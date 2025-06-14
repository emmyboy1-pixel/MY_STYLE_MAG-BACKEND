import BlogPost from "../models/blogPostModel.js";
import Category from "../models/categoryModel.js";
import User from "../models/userModels.js";

const createBlogPost = async (req, res) => {
  try {
    const { title, content, imageURL, categoryId, createdBy } = req.body;

    const existingCategory = await Category.findByPk(categoryId);
    if (!existingCategory) {
      return res
        .status(404)
        .json({ status: false, message: "Category not found" });
    }

    const existingUser = await User.findByPk(createdBy);
    if (!existingUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const newBlogPost = await BlogPost.create({
      title,
      content,
      imageURL,
      categoryId,
      createdBy,
    });

    if (!newBlogPost) {
      return res
        .status(500)
        .json({ status: false, message: "Blog post creation failed" });
    }

    return res
      .status(201)
      .json({ status: true, message: "Blog post created successfully" });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.findAll({});

    return res.status(200).json({
      status: true,
      message: "Blogs fetched successfully",
      data: blogPosts,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getSingleBlogPost = async (req, res) => {
  try {
    const blogId = Number(req.params.id);

    const existingBlogPost = await BlogPost.findByPk(blogId);

    if (!existingBlogPost) {
      return res.status(404).json({ status: false, message: "Blog not found" });
    }

    return res.status(200).json({
      status: true,
      message: "Blog fetched successfully",
      data: existingBlogPost,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const updateBlogPost = async (req, res) => {
  try {
    const blogId = Number(req.params.id);
    const { title, content, imageURL, categoryId, createdBy } = req.body;

    const existingCategory = await Category.findByPk(categoryId);
    if (!existingCategory) {
      return res
        .status(404)
        .json({ status: false, message: "Category not found" });
    }

    const existingUser = await User.findByPk(createdBy);
    if (!existingUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const newBlogPost = await BlogPost.create(
      {
        title,
        content,
        imageURL,
        categoryId,
        createdBy,
      },
      { where: { id: blogId } }
    );

    if (!newBlogPost) {
      return res
        .status(500)
        .json({ status: false, message: "Blog post update failed." });
    }

    return res
      .status(201)
      .json({ status: true, message: "Blog post updated successfully" });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const deleteBlogPost = async (req, res) => {
  try {
    const blogId = Number(req.params.id);

    const deletedCount = await BlogPost.destroy({
      where: { id: blogId },
    });

    if (deletedCount === 0) {
      return res.status(404).json({
        status: false,
        message: "Failed to delete blog or blog not found",
      });
    }

    return res
      .status(200)
      .json({ status: true, message: "Blog deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export {
  createBlogPost,
  getAllBlogPosts,
  getSingleBlogPost,
  updateBlogPost,
  deleteBlogPost,
};
