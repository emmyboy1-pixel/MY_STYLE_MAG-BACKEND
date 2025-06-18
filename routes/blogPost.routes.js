import express from "express";
import {
  createBlogPost,
  getAllBlogPostsForUser,
  getAllBlogPostsForAdmin,
  getSingleBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "../controllers/blog.controller.js";
import {
  authenticateUser,
  checkAuthorizedPermissions,
} from "../middleware/authentication.js";
import { validateBlogPost } from "../utils/validator/validators.js";
import validateRequestHandler from "../middleware/validation.js";

const blogPostRouter = express.Router();

blogPostRouter.use(authenticateUser);

blogPostRouter
  .route("/")
  .get(getAllBlogPostsForUser)
  .post(
    validateBlogPost,
    validateRequestHandler,
    checkAuthorizedPermissions("admin"),
    createBlogPost
  );
blogPostRouter.route("/admin/:id").get(getAllBlogPostsForAdmin);

blogPostRouter
  .route("/:id")
  .get(getSingleBlogPost)
  .patch(
    validateBlogPost,
    validateRequestHandler,
    checkAuthorizedPermissions("admin"),
    updateBlogPost
  )
  .delete(checkAuthorizedPermissions, deleteBlogPost);

export default blogPostRouter;
