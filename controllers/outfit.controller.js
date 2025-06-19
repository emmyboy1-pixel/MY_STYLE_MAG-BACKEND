import fs from "fs/promises";

import { Outfit, Category, Tag, User } from "../models/index.js";
import paginate from "../utils/pagination.js";
import asyncWrapper from "../middleware/async.js";
import {
  ConflictErrorResponse,
  NotFoundErrorResponse,
} from "../utils/error/index.js";
import { uploadImagesToCloudinary } from "../utils/images/uploadImagesToCloudinary.js";
import { updateCloudinaryImages } from "../utils/images/updateCloudinaryImages.js";
import { deleteCloudinaryImages } from "../utils/images/deleteCloudinaryImages.js";
import { sequelize } from "../config/dbConfig.js";

export const createOutfit = asyncWrapper(async (req, res, next) => {
  const { title, description, categoryId } = req.body;
  const createdBy = req.user.id;

  // validating if category exists
  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw new NotFoundErrorResponse("Category not found");
  }

  const tx = await sequelize.transaction();

  try {
    // creating the outfit
    const newOutfit = await Outfit.create(
      {
        title,
        description,
        categoryId,
        createdBy,
      },
      {
        transaction: tx,
        include: [
          { model: Category, attributes: ["name"], as: "category" },
          { model: User, attributes: ["name"], as: "creator" },
        ],
      }
    );

    const imageUrls = await uploadImagesToCloudinary(
      req,
      "outfit",
      newOutfit.id
    );

    let updatedOutfit;
    if (imageUrls.length !== 0) {
      updatedOutfit = await newOutfit.update(
        { imageUrls },
        { transaction: tx }
      );
    }

    await tx.commit();

    res.status(201).json({
      status: true,
      message: "Outfit created successfully",
      data: updatedOutfit,
    });
  } catch (error) {
    if (req.files?.length) {
      await Promise.all(req.files.map((file) => fs.unlink(file.path)));
    }
    await tx.rollback();
    throw error;
  }
});

export const getAllOutfits = asyncWrapper(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 30;
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
    offset: paginate(limit, page),
    limit: limit,
    order: [["createdAt", "DESC"]],
    include: [
      { model: Category, attributes: ["name"], as: "category" },
      { model: User, attributes: ["name"], as: "creator" },
      { model: User, attributes: ["name"], as: "updater" },
    ],
  });

  res.status(200).json({
    status: true,
    message: "Outfits fetched successfully",
    total: outfits.count,
    data: outfits.rows.map((outfit) => outfit.toJSON()),
  });
});

export const getSingleOutfit = asyncWrapper(async (req, res, next) => {
  const { id: outfitId } = req.params;
  const existingOutfit = await Outfit.findByPk(outfitId, {
    include: [
      { model: Category, attributes: ["name"], as: "category" },
      { model: User, attributes: ["name"], as: "creator" },
      { model: User, attributes: ["name"], as: "updater" },
    ],
  });

  if (!existingOutfit) {
    throw new NotFoundErrorResponse("Outfit not found");
  }

  res.status(200).json({
    status: true,
    message: "Outfit fetched Successfully",
    data: existingOutfit,
  });
});

export const updateOutfit = asyncWrapper(async (req, res, next) => {
  const { id: outfitId } = req.params;
  const { title, description, categoryId } = req.body;
  const updatedBy = req.user.id;

  const existingOutfit = await Outfit.findByPk(outfitId);
  if (!existingOutfit) {
    throw new NotFoundErrorResponse("Outfit not found");
  }

  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw new NotFoundErrorResponse("Category not found");
  }

  if (title !== existingOutfit.title) {
    const existingOutfitWithSameTitle = await Outfit.findOne({
      where: { title },
    });
    if (existingOutfitWithSameTitle) {
      throw new ConflictErrorResponse(
        "You already have another outfit with this name"
      );
    }
  }

  let newImagesUrls;
  if (req.files?.length) {
    newImagesUrls = await updateCloudinaryImages(
      req,
      "outfit",
      existingOutfit.id
    );
  }

  const [affectedRows] = await Outfit.update(
    { title, description, imageUrls: newImagesUrls, categoryId, updatedBy },
    { where: { id: outfitId } }
  );

  if (affectedRows === 0) {
    throw new NotFoundErrorResponse("Outfit not found or not updated");
  }

  const updatedOutfit = await Outfit.findByPk(outfitId, {
    include: [
      { model: Category, attributes: ["name"], as: "category" },
      { model: User, attributes: ["name"], as: "creator" },
      { model: User, attributes: ["name"], as: "updater" },
    ],
  });

  res.status(200).json({
    status: true,
    message: "Outfit Updated Successfully",
    data: updatedOutfit,
  });
});

export const deleteOutfit = asyncWrapper(async (req, res, next) => {
  const { id: outfitId } = req.params;

  const existingOutfit = await Outfit.findByPk(outfitId);
  if (!existingOutfit) {
    throw new NotFoundErrorResponse("Outfit not found");
  }

  const deleteCloudImages = await deleteCloudinaryImages(
    "outfit",
    existingOutfit.id
  );

  if (deleteCloudImages) {
    const deletedCount = await Outfit.destroy({
      where: { id: outfitId },
    });

    if (deletedCount === 0) {
      throw new NotFoundErrorResponse("Outfit not found");
    }
  }

  res.status(200).json({
    status: true,
    message: "Outfit deleted successfully.",
  });
});
