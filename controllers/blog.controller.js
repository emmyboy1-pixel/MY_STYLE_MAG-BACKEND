import fs from "fs/promises";

import { BlogPost, Category, User } from "../models/index.js";
import asyncWrapper from "../middleware/async.js";
import paginate from "../utils/pagination.js";
import { NotFoundErrorResponse } from "../utils/error/index.js";
import { uploadImagesToCloudinary } from "../utils/images/uploadImagesToCloudinary.js";
import { sequelize } from "../config/dbConfig.js";
import { updateCloudinaryImages } from "../utils/images/updateCloudinaryImages.js";
import { deleteCloudinaryImages } from "../utils/images/deleteCloudinaryImages.js";

const createBlogPost = asyncWrapper(async (req, res, next) => {
  const createdBy = req.user.id;
  const { title, content, status, categoryId } = req.body;

  const tx = await sequelize.transaction();
  try {
    const existingCategory = await Category.findByPk(categoryId);
    if (!existingCategory) {
      throw new NotFoundErrorResponse("Category not Found");
    }

    const newBlogPost = await BlogPost.create(
      {
        title,
        content,
        status,
        categoryId,
        createdBy,
      },
      {
        transaction: tx,
        include: [{ model: Category, attributes: ["name"], as: "category" }],
      }
    );

    const imageUrl = await uploadImagesToCloudinary(
      req,
      "blogPost",
      newBlogPost.id
    );

    const updatedBlogPost = await newBlogPost.update(
      { imageUrl: imageUrl[0] },
      { transaction: tx }
    );

    await tx.commit();

    return res.status(201).json({
      status: true,
      message: "Blog post created successfully",
      images: imageUrl,
      data: updatedBlogPost,
    });
  } catch (error) {
    await tx.rollback();
    throw error;
  } finally {
    if (req.files?.length) {
      await Promise.all(req.files.map((file) => fs.unlink(file.path)));
    }
  }
});

const getAllBlogPostsForUser = asyncWrapper(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 30;
  const blogPosts = await BlogPost.findAndCountAll({
    offset: paginate(limit, page),
    limit: limit,
    where: { status: "Published" },
    order: [["updatedAt", "DESC"]],
    include: [
      { model: Category, attributes: ["name"], as: "category" },
      { model: User, attributes: ["name"], as: "creator" },
      { model: User, attributes: ["name"], as: "updater" },
    ],
  });

  return res.status(200).json({
    status: true,
    message: "Blogs fetched successfully",
    total: blogPosts.count,
    data: blogPosts.rows.map((post) => post.toJSON()),
  });
});

const getAllBlogPostsForAdmin = asyncWrapper(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 30;
  const blogPosts = await BlogPost.findAndCountAll({
    offset: paginate(limit, page),
    limit: limit,
    order: [["updatedAt", "DESC"]],
    include: [
      { model: Category, attributes: ["name"], as: "category" },
      { model: User, attributes: ["name"], as: "creator" },
      { model: User, attributes: ["name"], as: "updater" },
    ],
  });

  return res.status(200).json({
    status: true,
    message: "Blogs fetched successfully",
    total: blogPosts.count,
    data: blogPosts.rows.map((post) => post.toJSON()),
  });
});

const getSingleBlogPost = asyncWrapper(async (req, res, next) => {
  const { id: blogId } = req.params;
  const { role: userRole } = req.user;

  let existingBlogPost = await BlogPost.findByPk(blogId, {
    include: [
      { model: Category, attributes: ["name"], as: "category" },
      { model: User, attributes: ["name"], as: "creator" },
      { model: User, attributes: ["name"], as: "updater" },
    ],
  });

  if (!existingBlogPost) {
    throw new NotFoundErrorResponse("Blog not found");
  }

  if (userRole === "user") {
    await BlogPost.increment("views", { by: 1, where: { id: blogId } });
    existingBlogPost = await BlogPost.findByPk(blogId, {
      include: [
        { model: Category, attributes: ["name"], as: "category" },
        { model: User, attributes: ["name"], as: "creator" },
        { model: User, attributes: ["name"], as: "updater" },
      ],
    });
  }

  return res.status(200).json({
    status: true,
    message: "Blog fetched successfully",
    data: existingBlogPost,
  });
});

const updateBlogPost = asyncWrapper(async (req, res, next) => {
  const updatedBy = req.user.id;
  const { id: blogId } = req.params;
  const { title, content, status, categoryId } = req.body;

  try {
    const existingCategory = await Category.findByPk(categoryId);
    if (!existingCategory) {
      throw new NotFoundErrorResponse("Category not found");
    }

    const existingBlogPost = await BlogPost.findByPk(blogId);
    if (!existingBlogPost) {
      throw new NotFoundErrorResponse("Blog post not found");
    }

    const newImageUrl = await updateCloudinaryImages(
      req,
      "blogPost",
      existingBlogPost.id
    );

    const [affectedRows] = await BlogPost.update(
      {
        title,
        content,
        imageUrl: newImageUrl.length > 0 ? newImageUrl[0] : null,
        status,
        categoryId,
        updatedBy,
      },
      {
        where: { id: blogId },
      }
    );

    if (affectedRows === 0) {
      throw new NotFoundErrorResponse("Blog post not found or not updated");
    }

    const updatedBlogPost = await BlogPost.findByPk(blogId, {
      include: [
        { model: Category, attributes: ["name"], as: "category" },
        { model: User, attributes: ["name"], as: "creator" },
        { model: User, attributes: ["name"], as: "updater" },
      ],
    });

    return res.status(200).json({
      status: true,
      message: "Blog post updated successfully",
      data: updatedBlogPost,
    });
  } catch (error) {
    throw error;
  } finally {
    if (req.files?.length) {
      await Promise.all(req.files.map((file) => fs.unlink(file.path)));
    }
  }
});

const deleteBlogPost = asyncWrapper(async (req, res, next) => {
  const { id: blogId } = req.params;

  const existingBlogPost = await BlogPost.findByPk(blogId);
  if (!existingBlogPost) {
    throw new NotFoundErrorResponse("Blog post not found");
  }

  let deletedCloudImages = false;
  if (existingBlogPost.imageUrl != null) {
    deletedCloudImages = await deleteCloudinaryImages(
      "blogPost",
      existingBlogPost.id
    );
  }

  if (
    (existingBlogPost.imageUrl && deletedCloudImages) ||
    existingBlogPost.imageUrl === null
  ) {
    const deletedCount = await BlogPost.destroy({
      where: { id: blogId },
    });

    if (deletedCount === 0) {
      throw new NotFoundErrorResponse("Blog post not Found");
    }
  }

  return res
    .status(200)
    .json({ status: true, message: "Blog post deleted successfully" });
});

export {
  createBlogPost,
  getAllBlogPostsForUser,
  getAllBlogPostsForAdmin,
  getSingleBlogPost,
  updateBlogPost,
  deleteBlogPost,
};
