import { Lookbook, Outfit, Category, User } from "../models/index.js";
import { Op } from "sequelize";
import asyncWrapper from "../middleware/async.js";
import {
  ConflictErrorResponse,
  NotFoundErrorResponse,
} from "../utils/error/index.js";

export const createLookbook = asyncWrapper(async (req, res, next) => {
  const { name } = req.body;
  const { id: userId } = req.user;

  const existingLookBook = await Lookbook.findOne({ where: { name, userId } });
  if (existingLookBook) {
    throw new ConflictErrorResponse(
      "You already have another existinglookBook with this name"
    );
  }

  // creating existinglookBook
  const newLookbook = await Lookbook.create({ name, userId });

  res.status(201).json({
    status: true,
    message: "Lookbook created successfully",
    data: newLookbook,
  });
});

export const getAllLookbooks = asyncWrapper(async (req, res, next) => {
  const { id: userId } = req.user;

  // Get all lookbooks belonging to the user
  const lookBooks = await Lookbook.findAndCountAll({
    where: { userId },
    attributes: {
      exclude: ["userId"],
    },
    order: [["updatedAt", "DESC"]],
  });

  res.status(200).json({
    status: true,
    message: "Lookbooks retrieved successfully",
    total: lookBooks.count,
    data: lookBooks.rows.map((lookBook) => lookBook.toJSON()),
  });
});

export const getSingleLookBook = asyncWrapper(async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: lookBookId } = req.params;

  const existingLookBook = await Lookbook.findOne({
    where: {
      [Op.and]: [{ id: lookBookId }, { userId }],
    },
    attributes: {
      exclude: ["userId"],
    },
    include: [
      {
        model: Outfit,
        as: "outfits",
        through: { attributes: [] },
        include: [
          {
            model: Category,
            attributes: ["name"],
            as: "category",
          },
          {
            model: User,
            attributes: ["name"],
            as: "creator",
          },
          {
            model: User,
            attributes: ["name"],
            as: "updater",
          },
        ],
      },
    ],
  });

  if (!existingLookBook) {
    throw new NotFoundErrorResponse("LookBook not found");
  }

  const totalOutfits = await existingLookBook.countOutfits();

  return res.status(200).json({
    status: true,
    message: "lookBook fetched Successfully",
    totalOutfits: totalOutfits,
    data: existingLookBook,
  });
});

export const updateLookBook = asyncWrapper(async (req, res, next) => {
  const { id: userId } = req.user;
  const { name } = req.body;
  const { id: lookBookId } = req.params;

  // Check if existinglookBook exists
  const existingLookBook = await Lookbook.findOne({
    where: { id: lookBookId, userId },
  });
  if (!existingLookBook) {
    throw new NotFoundErrorResponse("Lookbook not found");
  }

  // Uniqueness check: is there another existinglookBook with the same name for this user?
  if (name !== existingLookBook.name) {
    const existingLookbookWithSameName = await Lookbook.findOne({
      where: { name, userId },
    });
    if (existingLookbookWithSameName) {
      throw new ConflictErrorResponse(
        "You already have another existinglookBook with this name"
      );
    }
  }

  // Rename the existinglookBook
  const [affectedRows] = await Lookbook.update(
    { name },
    { where: { id: lookBookId, userId } }
  );

  if (affectedRows === 0) {
    throw new NotFoundErrorResponse("Lookbook not found or not updated");
  }
  const updatedLookBook = await Lookbook.findOne({
    where: { id: lookBookId, userId },
  });

  return res.status(200).json({
    status: true,
    message: "Lookbook renamed successfully",
    data: updatedLookBook,
  });
});

export const deleteLookbook = asyncWrapper(async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: lookBookId } = req.params;

  const deletedCount = await Lookbook.destroy({
    where: { id: lookBookId, userId },
  });

  if (deletedCount === 0) {
    throw new NotFoundErrorResponse("LookBook not found");
  }

  return res.status(200).json({
    status: true,
    message: "LookBook deleted successfully.",
  });
});

export const addOutfitToLookBook = asyncWrapper(async (req, res, next) => {
  const { id: lookBookId } = req.params;
  const { outfitId } = req.body;

  const existingOutfit = await Outfit.findByPk(outfitId);
  if (!existingOutfit) {
    throw new NotFoundErrorResponse("Outfit not found");
  }

  const existingLookbook = await Lookbook.findByPk(lookBookId);
  if (!existingLookbook) {
    throw new NotFoundErrorResponse("Lookbook not found");
  }

  const linked = await existingLookbook.hasOutfit(outfitId);
  if (linked) {
    throw new ConflictErrorResponse("Outfit linked to this lookbook");
  }

  await existingLookbook.addOutfit(outfitId);

  return res.status(200).json({
    status: true,
    message: "Outfit added to Lookbook sucessfully",
  });

  // Add association between loobookoutfit and outfit
});

export const deleteOutfitFromLookBook = asyncWrapper(async (req, res, next) => {
  const { id: lookBookId } = req.params;
  const { outfitId } = req.body;

  const existingOutfit = await Outfit.findByPk(outfitId);
  if (!existingOutfit) {
    throw new NotFoundErrorResponse("Outfit not found");
  }

  const existingLookbook = await Lookbook.findByPk(lookBookId);
  if (!existingLookbook) {
    throw new NotFoundErrorResponse("Lookbook not found");
  }

  const linked = await existingLookbook.hasOutfit(outfitId);
  if (!linked) {
    throw new ConflictErrorResponse("Outfit not linked to this lookbook");
  }

  await existingLookbook.removeOutfit(outfitId);

  return res.status(200).json({
    status: true,
    message: "Outfit deleted from Lookbook sucessfully",
  });
});
