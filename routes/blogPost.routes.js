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
import upload from "../middleware/multer.js";

const blogPostRouter = express.Router();

blogPostRouter.use(authenticateUser);

blogPostRouter
  .route("/")
  .get(getAllBlogPostsForUser)
  .post(
    upload.array("image", 10),
    validateBlogPost,
    validateRequestHandler,
    checkAuthorizedPermissions("admin"),
    createBlogPost
  );
blogPostRouter
  .route("/admin")
  .get(checkAuthorizedPermissions("admin"), getAllBlogPostsForAdmin);

blogPostRouter
  .route("/:id")
  .get(getSingleBlogPost)
  .patch(
    upload.array("image", 10),
    validateBlogPost,
    validateRequestHandler,
    checkAuthorizedPermissions("admin"),
    updateBlogPost
  )
  .delete(checkAuthorizedPermissions("admin"), deleteBlogPost);

export default blogPostRouter;
