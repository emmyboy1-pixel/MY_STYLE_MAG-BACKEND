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

blogPostRouter.use(authenticateUser);

blogPostRouter.route("/").get(getAllBlogPosts).post(createBlogPost);

blogPostRouter
  .route("/:id")
  .get(getSingleBlogPost)
  .patch(updateBlogPost)
  .delete(deleteBlogPost);

export default blogPostRouter;
