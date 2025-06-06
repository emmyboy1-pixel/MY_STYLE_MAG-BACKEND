import Category from "../models/categoryModel.js";

export const createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name) {
      return res.status(400).json({
        status: false,
        message: "Category name is required",
        data: [],
      });
    }

    const existingCategory = await Category.findOne({ where: { name: name } });

    if (existingCategory) {
      return res
        .status(404)
        .json({ status: false, message: "Category already in use", data: [] });
    }

    const newCategory = await Category.create({
      name,
      type: type || "outfit", // default if not provided
    });

    if (!newCategory) {
      return res.status(400).json({
        status: false,
        message: "Could not create category",
        data: [],
      });
    }

    res.status(201).json({
      status: true,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error creating category", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

//  Get all categories
export const getAllCategories = async (req, res) => {
  const categories = await Category.findAndCountAll({
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    status: true,
    message: "All categories fetched successfully",
    data: categories,
  });
};

export const getSingleCategory = async (req, res) => {
  const { id: categoryId } = req.params;

  const existingCategory = await Category.findByPk(categoryId);

  if (!existingCategory) {
    res
      .status(404)
      .json({ status: false, message: "Category not found", data: [] });
  }

  res.status(200).json({
    status: true,
    message: "Category fetched Successfully",
    data: existingCategory.dataValues,
  });
};

export const updateCategory = async (req, res) => {
  const { id: categoryId } = req.params;
  const { name, type } = req.body;

  const existingCategory = await Category.findByPk(categoryId);

  if (!existingCategory) {
    res
      .status(404)
      .json({ status: false, message: "Category not found", data: [] });
  }

  if (name !== existingCategory.name) {
    const existingName = await Category.findOne({ where: { name: name } });
    if (existingName) {
      res
        .status(400)
        .json({ status: false, message: "Name already in use", data: [] });
    }
  }

  const updateCategory = await Category.update(
    { name, type },
    { where: { id: categoryId } }
  );

  if (!updateCategory) {
    return res.status(500).json({
      status: false,
      message: "Could not create category",
      data: [],
    });
  }

  res
    .status(200)
    .json({ status: true, message: "Category Updated Successfully" });
};

export const deleteCategory = async (req, res) => {
  const { id: categoryId } = req.params;

  const deletedCount = await Category.destroy({
    where: { id: categoryId },
  });

  if (deletedCount === 0) {
    res
      .status(404)
      .json({ status: false, message: "Category not found", data: [] });
  }

  res.status(200).json({
    status: true,
    message: "Category deleted successfully.",
    data: [],
  });
};
