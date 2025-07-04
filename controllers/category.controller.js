import { Category, User } from "../models/index.js";
import asyncWrapper from "../middleware/async.js";
import {
  BadRequestErrorResponse,
  NotFoundErrorResponse,
} from "../utils/error/index.js";

export const createCategory = asyncWrapper(async (req, res, next) => {
  const { name } = req.body;
  const { id: createdBy } = req.user;

  const existingCategory = await Category.findOne({ where: { name: name } });

  if (existingCategory) {
    throw new BadRequestErrorResponse("Category already in use");
  }

  const newCategory = await Category.create(
    { name, createdBy },
    { include: [{ model: User, attributes: ["name"], as: "creator" }] }
  );

  return res.status(201).json({
    status: true,
    message: "Category created successfully",
    data: newCategory,
  });
});

export const getAllCategories = asyncWrapper(async (req, res, next) => {
  const categories = await Category.findAndCountAll({
    order: [["updatedAt", "DESC"]],
    include: [
      { model: User, attributes: ["name"], as: "creator" },
      { model: User, attributes: ["name"], as: "updater" },
    ],
  });

  return res.status(200).json({
    status: true,
    message: "Categories fetched successfully",
    total: categories.count,
    data: categories.rows.map((category) => category.toJSON()),
  });
});

export const getSingleCategory = asyncWrapper(async (req, res, next) => {
  const { id: categoryId } = req.params;

  const existingCategory = await Category.findByPk(categoryId, {
    include: [
      { model: User, attributes: ["name"], as: "creator" },
      { model: User, attributes: ["name"], as: "updater" },
    ],
  });

  if (!existingCategory) {
    throw new NotFoundErrorResponse("Category not found");
  }

  return res.status(200).json({
    status: true,
    message: "Category fetched Successfully",
    data: existingCategory,
  });
});

export const updateCategory = asyncWrapper(async (req, res, next) => {
  const { id: categoryId } = req.params;
  const { name } = req.body;
  const { id: updatedBy } = req.user;

  const existingCategory = await Category.findByPk(categoryId);

  if (!existingCategory) {
    throw new NotFoundErrorResponse("Category not found");
  }

  if (name !== existingCategory.name) {
    const existingName = await Category.findOne({ where: { name: name } });
    if (existingName) {
      throw new BadRequestErrorResponse("Name already in use");
    }
  }

  const [affectedRows] = await Category.update(
    { name, updatedBy },
    { where: { id: categoryId } }
  );

  if (affectedRows === 0) {
    throw new NotFoundErrorResponse("Category not found or not updated");
  }

  const updatedCategory = await Category.findByPk(categoryId, {
    include: [
      { model: User, attributes: ["name"], as: "creator" },
      { model: User, attributes: ["name"], as: "updater" },
    ],
  });

  return res.status(200).json({
    status: true,
    message: "Category Updated Successfully",
    data: updatedCategory,
  });
});

export const deleteCategory = asyncWrapper(async (req, res, next) => {
  const { id: categoryId } = req.params;

  const deletedCount = await Category.destroy({
    where: { id: categoryId },
  });

  if (deletedCount === 0) {
    throw new NotFoundErrorResponse("Category not found");
  }

  return res.status(200).json({
    status: true,
    message: "Category deleted successfully.",
  });
});
