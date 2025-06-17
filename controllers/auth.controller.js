import User from "../models/userModels.js";
import bcrypt from "bcrypt";
import { attachAuthCookiesToResponse } from "../utils/auth/jwt.js";
import generateEmail from "../services/email/email.template.js";
import sendEmail from "../services/email/email.service.js";
import { Op } from "sequelize";
import {
  BadRequestErrorResponse,
  NotFoundErrorResponse,
} from "../utils/error/index.js";
import asyncWrapper from "../middleware/async.js";

const generateToken = () => {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const register = asyncWrapper(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const existingEmail = await User.findOne({ where: { email: email } });

  if (existingEmail) {
    throw new BadRequestErrorResponse("Email Already in use");
  }

  const hashed_password = bcrypt.hashSync(password, 10);

  await User.create({
    name,
    email,
    password: hashed_password,
    role: role || "user",
  });

  res.status(201).json({
    status: true,
    message: "User created successfully",
  });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const errorMessage = "Invalid username or password";

  const existingUser = await User.findOne({ where: { email: email } });

  if (!existingUser) {
    throw new NotFoundErrorResponse(errorMessage);
  }

  const passwordMatch = await bcrypt.compare(password, existingUser.password);
  if (!passwordMatch) {
    throw new NotFoundErrorResponse(errorMessage);
  }

  const userData = existingUser.dataValues;
  const tokenUser = {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    createdAt: userData.createdAt,
    updatedAt: userData.updatedAt,
  };
  attachAuthCookiesToResponse({ res, user: tokenUser });

  res.status(200).json({
    status: true,
    message: "User Login Successfully",
    data: tokenUser,
  });
});

const logOut = asyncWrapper(async (req, res, next) => {
  res.clearCookie("authToken");

  res
    .status(200)
    .json({ status: true, message: "User Logged Out Successfully" });
});

// TODO:  sendVerificationEmail, verifyEmail.
const forgotPassword = asyncWrapper(async (req, res, next) => {
  const { email } = req.body;

  const existingUser = await User.findOne({
    where: { email: email },
  });

  if (existingUser) {
    const resetToken = generateToken().toString();
    const fifTeenMinutes = 1000 * 60 * 15;
    const resetTokenExpiry = new Date(Date.now() + fifTeenMinutes);

    const emailHtml = generateEmail(resetToken);

    const emailSent = await sendEmail(email, emailHtml);

    if (emailSent) {
      await User.update(
        { resetToken, resetTokenExpiry },
        { where: { email: email } }
      );
    }
  }

  res.status(200).json({
    status: true,
    message: `Email sent Successfully to ${email}, if account with email exists`,
  });
});

const verifyResetToken = asyncWrapper(async (req, res, next) => {
  const { email, resetToken } = req.body;

  const existingUser = await User.findOne({
    where: {
      email,
      resetToken,
      resetTokenExpiry: { [Op.gte]: new Date() },
    },
    attributes: ["email"],
  });

  if (!existingUser) {
    throw new NotFoundErrorResponse("Token verification failed");
  }

  res
    .status(200)
    .json({ status: true, message: "Token verified successfully", data: null });
});

const changePassword = asyncWrapper(async (req, res, next) => {
  const { password, resetToken, email } = req.body;

  const existingUser = await User.findOne({
    where: {
      email,
      resetToken,
      resetTokenExpiry: { [Op.gte]: new Date() },
    },
    attributes: ["id"],
  });

  if (!existingUser) {
    throw new NotFoundErrorResponse("Token verification failed");
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const [affectedRows] = await User.update(
    { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
    { where: { id: existingUser.id } }
  );

  if (affectedRows === 0) {
    throw new NotFoundErrorResponse("User not found or password not updated");
  }

  res
    .status(200)
    .json({ status: true, message: "Password updated successfully" });
});

export {
  register,
  login,
  logOut,
  forgotPassword,
  verifyResetToken,
  changePassword,
};
