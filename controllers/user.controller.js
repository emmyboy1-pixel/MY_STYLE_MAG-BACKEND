import User from "../models/user.model.js";
import asyncWrapper from "../middleware/async.js";
import paginate from "../utils/pagination.js";
import {
  UnAuthorizedErrorResponse,
  NotFoundErrorResponse,
} from "../utils/error/index.js";

export const getAllUsers = asyncWrapper(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 30;

  const users = await User.findAndCountAll({
    offset: paginate(limit, page),
    limit: limit,
    order: [["createdAt", "DESC"]],
    attributes: { exclude: ["password", "resetToken", "resetTokenExpiry"] },
  });

  res.status(200).json({
    status: true,
    message: "All users fetched successfully",
    total: users.count,
    data: users.rows.map((user) => user.toJSON()),
  });
});

export const deleteUser = asyncWrapper(async (req, res) => {
  const { adminKey } = req.body;
  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    throw new UnAuthorizedErrorResponse(
      "You're not authorized to perform this action"
    );
  }

  const { id: userId } = req.params;

  const deletedCount = await User.destroy({
    where: { id: userId },
  });

  if (deletedCount === 0) {
    throw new NotFoundErrorResponse("User not found");
  }

  return res.status(200).json({
    status: true,
    message: "User deleted successfully.",
  });
});
