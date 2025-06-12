import Outfit from "../models/outfitModel.js";
import Category from "../models/categoryModel.js";
import User from "../models/userModels.js";
import Tag from "../models/tagModel.js";
import cloudinary from "../config/cloudinary.js";

export const createOutfit = async (req, res) => {
  try {
    const { title, description, imageUrl, categoryId } = req.body;
    const createdBy = req.user.id;

    // validating if category exists
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({
        error: "Category not found",
      });
    }

    // creating the outfit
    const outfit = await Outfit.create({
      title,
      description,
      imageUrl,
      categoryId,
      createdBy,
    });

    if (!outfit) {
      res.status(400).json({
        status: false,
        message: "Could not create the outfit",
        data: [],
      });
    }

    res.status(201).json({
      status: true,
      message: "Outfit created successfully",
      data: outfit,
    });
  } catch (error) {
    console.error("Error creating the outfit: ", error);
    res.status(500).json({
      error: "Internal server error occured",
      details: error.message,
    });
  }
};

//  get outfit

export const getAllOutfits = async (req, res) => {
 const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const nextCursor = req.query.next_cursor || null;

  try {
    const { tag, category } = req.query;

    const whereClause = {};
    const includeClause = [];

    // Filter by category if provided
    if (category) {
      whereClause.categoryId = category;
    }

    // Filter by tag if provided
    if (tag) {
      includeClause.push({
        model: Tag,
        where: { name: tag },
        through: { attributes: [] }, // Hide join table attributes
      });
    }

    const outfits = await Outfit.findAndCountAll({
      where: whereClause,
      include: includeClause,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      status: true,
      message: "Outfits fetched successfully",
      data: outfits,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error occurred",
      details: error.message,
    });
  }
};


export const getSingleOutfit = async (req, res) => {
  try {
    const { id: outfitId } = req.params;
    const existingOutfit = await Outfit.findByPk(outfitId);

    if (!existingOutfit) {
      res
        .status(404)
        .json({ status: false, message: "Outfit not found", data: [] });
    }

    res.status(200).json({
      status: true,
      message: "Outfit fetched Successfully",
      data: existingOutfit.dataValues,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error occured",
      details: error.message,
    });
  }
};

export const updateOutfit = async (req, res) => {
  try {
    const { id: outfitId } = req.params;
    const { title, description, imageUrl, categoryId } = req.body;
    const createdBy = req.user.id;

    const existingOutfit = await Outfit.findByPk(outfitId);

    if (!existingOutfit) {
      return res
        .status(404)
        .json({ status: false, message: "Outfit not found", data: [] });
    }

    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({
        error: "Category not found",
      });
    }

    const updateOutfit = await Outfit.update(
      { title, description, imageUrl, categoryId, createdBy },
      { where: { id: outfitId } }
    );

    if (!updateOutfit) {
      return res.status(500).json({
        status: false,
        message: "Could not update outfit details",
        data: [],
      });
    }

    res
      .status(200)
      .json({ status: true, message: "Outfit Updated Successfully" });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error occured",
      details: error.message,
    });
  }
};

export const deleteOutfit = async (req, res) => {
  const { id: outfitId } = req.params;

  const deletedCount = await Outfit.destroy({
    where: { id: outfitId },
  });

  if (deletedCount === 0) {
    res
      .status(404)
      .json({ status: false, message: "Outfit not found", data: [] });
  }

  res.status(200).json({
    status: true,
    message: "Outfit deleted successfully.",
    data: [],
  });
};
