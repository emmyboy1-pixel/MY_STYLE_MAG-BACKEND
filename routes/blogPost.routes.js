import express from "express";
import {
  createBlogPost,
  getAllBlogPosts,
  getSingleBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "../controllers/blog.controller.js";
import { authenticateUser } from "../middleware/authentication.js";

const blogPostRouter = express.Router();

blogPostRouter
  .route("/")
  .get(authenticateUser, getAllBlogPosts)
  .post(authenticateUser, createBlogPost);

blogPostRouter
  .route("/:id")
  .get(authenticateUser, getSingleBlogPost)
  .patch(authenticateUser, updateBlogPost)
  .delete(authenticateUser, deleteBlogPost);

export default blogPostRouter;
