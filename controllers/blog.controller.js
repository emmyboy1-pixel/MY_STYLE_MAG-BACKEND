import { BlogPost, Category } from "../models/index.js";
import asyncWrapper from "../middleware/async.js";
import paginate from "../utils/pagination.js";
import { NotFoundErrorResponse } from "../utils/error/index.js";

const createBlogPost = asyncWrapper(async (req, res, next) => {
  const createdBy = req.user.id;
  const { title, content, status, categoryId } = req.body;

  const existingCategory = await Category.findByPk(categoryId);
  if (!existingCategory) {
    throw new NotFoundErrorResponse("Category not Found");
  }

  const newBlogPost = await BlogPost.create({
    title,
    content,
    status,
    categoryId,
    createdBy,
  });

  return res.status(201).json({
    status: true,
    message: "Blog post created successfully",
    data: newBlogPost,
  });
});

const getAllBlogPostsForUser = asyncWrapper(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 30;
  const blogPosts = await BlogPost.findAndCountAll({
    offset: paginate(limit, page),
    limit: limit,
    where: { status: "Published" },
    order: [["updatedAt", "DESC"]],
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

  let existingBlogPost = await BlogPost.findByPk(blogId);

  if (!existingBlogPost) {
    throw new NotFoundErrorResponse("Blog not found");
  }

  if (userRole === "user") {
    await BlogPost.increment("views", { by: 1, where: { id: blogId } });
    existingBlogPost = await BlogPost.findByPk(blogId);
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

  const [affectedRows] = await BlogPost.update(
    {
      title,
      content,
      status,
      categoryId,
      updatedBy,
    },
    { where: { id: blogId } }
  );

  if (affectedRows === 0) {
    throw new NotFoundErrorResponse("Blog post not found or not updated");
  }

  const updatedBlogPost = await BlogPost.findByPk(blogId);

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
