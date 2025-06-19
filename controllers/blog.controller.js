import fs from "fs/promises";

import { BlogPost, Category, User } from "../models/index.js";
import asyncWrapper from "../middleware/async.js";
import paginate from "../utils/pagination.js";
import { NotFoundErrorResponse } from "../utils/error/index.js";
import { uploadImagesToCloudinary } from "../utils/images/uploadImagesToCloudinary.js";
import { sequelize } from "../config/dbConfig.js";
import { updateCloudinaryImages } from "../utils/images/updateCloudinaryImages.js";

const createBlogPost = asyncWrapper(async (req, res, next) => {
  const createdBy = req.user.id;
  const { title, content, status, categoryId } = req.body;

  const existingCategory = await Category.findByPk(categoryId);
  if (!existingCategory) {
    throw new NotFoundErrorResponse("Category not Found");
  }

  const tx = await sequelize.transaction();
  try {
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

    let updatedBlogPost;
    if (imageUrl.length !== 0) {
      updatedBlogPost = await newBlogPost.update(
        { imageUrl: imageUrl[0] },
        { transaction: tx }
      );
    }

    await tx.commit();

    return res.status(201).json({
      status: true,
      message: "Blog post created successfully",
      images: imageUrl,
      data: updatedBlogPost,
    });
  } catch (error) {
    if (req.files?.length) {
      await Promise.all(req.files.map((file) => fs.unlink(file.path)));
    }
    await tx.rollback();
    throw error;
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

  const existingCategory = await Category.findByPk(categoryId);
  if (!existingCategory) {
    throw new NotFoundErrorResponse("Category not found");
  }

  const existingBlogPost = await BlogPost.findByPk(blogId);
  if (!existingBlogPost) {
    throw new NotFoundErrorResponse("Blog post not found");
  }

  let newImageUrl = existingBlogPost.imageUrl;
  if (req.files?.length) {
    newImageUrl = await updateCloudinaryImages(
      req,
      "blogPost",
      existingBlogPost.id
    );
  }

  const [affectedRows] = await BlogPost.update(
    {
      title,
      content,
      imageUrl: newImageUrl[0],
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
});

const deleteBlogPost = asyncWrapper(async (req, res, next) => {
  const { id: blogId } = req.params;

  const deletedCount = await BlogPost.destroy({
    where: { id: blogId },
  });

  if (deletedCount === 0) {
    throw new Error("Blog not Found");
  }

  return res
    .status(200)
    .json({ status: true, message: "Blog deleted successfully" });
});

export {
  createBlogPost,
  getAllBlogPostsForUser,
  getAllBlogPostsForAdmin,
  getSingleBlogPost,
  updateBlogPost,
  deleteBlogPost,
};
