import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", createCategory);

router.get("/", getAllCategories);

router.get("/:id", getSingleCategory);

router.put("/:id", updateCategory);

router.delete("/:id", deleteCategory);

export default router;
