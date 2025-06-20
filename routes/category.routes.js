import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
} from "../controllers/category.controller.js";
import {
  authenticateUser,
  checkAuthorizedPermissions,
} from "../middleware/authentication.js";
import validateRequestHandler from "../middleware/validation.js";
import { validateName } from "../utils/validator/validators.js";

const categoryRouter = express.Router();

categoryRouter.use(authenticateUser);

categoryRouter
  .route("/")
  .get(getAllCategories)
  .post(
    checkAuthorizedPermissions("admin"),
    [validateName],
    validateRequestHandler,
    createCategory
  );

categoryRouter
  .route("/:id")
  .get(getSingleCategory)
  .patch(
    checkAuthorizedPermissions("admin"),
    validateName,
    validateRequestHandler,
    updateCategory
  )
  .delete(checkAuthorizedPermissions("admin"), deleteCategory);

export default categoryRouter;
