import Lookbook from "../models/lookbookModels.js";
import User from "../models/userModels.js";
import { Op } from "sequelize";

// create a lookbook
export const createLookbook = asyncWrapper(async (req, res, next) => {
  const { name } = req.body;
  const userId = Number(req.params.userId);

  // checking if user exist here
  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({
      status: false,
      message: "User not found ",
      data: [],
    });
  }

  // creating lookbook
  const newLookbook = await Lookbook.create({ userId, name });

  if (!newLookbook) {
    res.status(400).json({
      status: false,
      message: "Could not create the new Lookbook",
      data: [],
    });
  }

  res.status(201).json({
    message: "Lookbook created successfully",
    Lookbook: newLookbook,
  });
});

export const renamelookbook = asyncWrapper(async (req, res, next) => {
  const { name } = req.body;
  const userId = Number(req.params.userId);
  const lookbookId = Number(req.params.lookbookId);

  // Check if user exists
  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({
      status: false,
      message: "User not found",
      data: [],
    });
  }

  // Check if lookbook exists
  const lookbook = await Lookbook.findByPk(lookbookId);
  if (!lookbook) {
    return res.status(404).json({
      status: false,
      message: "Lookbook not found",
      data: [],
    });
  }

  // Check if lookbook belongs to the user
  if (lookbook.userId !== userId) {
    return res.status(403).json({
      status: false,
      message: "You are not authorized to rename this lookbook",
      data: [],
    });
  }

  // Uniqueness check: is there another lookbook with the same name for this user?
  const existingLookbook = await Lookbook.findOne({
    where: {
      userId,
      name,
      id: { [Op.ne]: lookbookId }, // Ensure it's not the same lookbook we're updating
    },
  });

  if (existingLookbook) {
    return res.status(409).json({
      status: false,
      message: "You already have another lookbook with this name",
      data: [],
    });
  }

  // Rename the lookbook
  const updatedLookbook = await lookbook.update({ name });

  return res.status(200).json({
    status: true,
    message: "Lookbook renamed successfully",
    lookbook: updatedLookbook,
  });
});

export const deleteLookbook = asyncWrapper(async (req, res, next) => {
  const userId = Number(req.params.userId);
  const lookbookId = Number(req.params.lookbookId);

  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({
      status: false,
      message: "User not found",
      data: [],
    });
  }

  const lookbook = await Lookbook.findByPk(lookbookId);

  if (!lookbook) {
    return res.status(404).json({
      status: false,
      message: "Lookbook not found",
      data: [],
    });
  }

  if (lookbook.userId !== userId) {
    return res.status(403).json({
      status: false,
      message: "You are not authorized to delete this lookbook",
      data: [],
    });
  }

  await lookbook.destroy();

  res.status(200).json({
    status: true,
    message: "Lookbook deleted successfully",
  });
});

// get all lookbooks
export const getAllLookbooks = asyncWrapper(async (req, res, next) => {
  const userId = Number(req.params.userId);

  // Check if user exists
  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({
      status: false,
      message: "User not found",
      data: [],
    });
  }

  // Get all lookbooks belonging to the user
  const lookbooks = await Lookbook.findAll({
    where: { userId },
  });

  res.status(200).json({
    status: true,
    message: "Lookbooks retrieved successfully",
    data: lookbooks,
  });
});
