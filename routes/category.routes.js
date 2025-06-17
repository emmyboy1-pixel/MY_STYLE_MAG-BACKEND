import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
} from "../controllers/category.controller.js";
import { authenticateUser } from "../middleware/authentication.js";

const categoryRouter = express.Router();

categoryRouter.use(authenticateUser);

categoryRouter.route("/").get(getAllCategories).post(createCategory);

categoryRouter
  .route("/:id")
  .get(getSingleCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

export default categoryRouter;
