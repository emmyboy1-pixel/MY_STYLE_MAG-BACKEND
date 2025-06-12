import User from "../models/userModels.js";
import bcrypt from "bcrypt";
import { attachCookiesToResponse } from "../utils/auth/jwt.js";
import generateEmail from "../services/email/email.template.js";
import sendEmail from "../services/email/email.service.js";
import { Op } from "sequelize";

const generateToken = () => {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingEmail = await User.findOne({ where: { email: email } });

    if (existingEmail) {
      return res
        .status(404)
        .json({ status: false, message: "Email already in use", data: [] });
    }

    const hashed_password = bcrypt.hashSync(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed_password,
      role: "user" || role,
    });

    if (!user) {
      return res.status(500).json({
        status: false,
        message: "Registration error",
        data: [],
      });
    }

    res.status(201).json({
      status: true,
      message: "User created successfully",
      data: [],
    });
  } catch (error) {
    res.status(500).json({
      error: "User Registration unsuccessfully",
      details: error.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const errorMessage = "Wrong username or password";

  const existingUser = await User.findOne({ where: { email: email } });

  if (!existingUser) {
    return res
      .status(401)
      .json({ status: false, message: errorMessage, data: [] });
  }

  const passwordMatch = await bcrypt.compare(password, existingUser.password);
  if (!passwordMatch) {
    return res
      .status(401)
      .json({ status: false, message: errorMessage, data: [] });
  }

  // Remove password from user data
  const { password: savedPassword, ...tokenUser } = existingUser.dataValues;
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(200).json({
    status: true,
    message: "User Login Successfully",
    data: tokenUser,
  });
};

const logOut = async (req, res) => {
  res.clearCookie("accessToken");

  res
    .status(200)
    .json({ status: true, message: "User Logged Out Successfully", data: [] });
};

// TODO:  sendVerificationEmail, verifyEmail.
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const existingUser = await User.findOne({
    where: { email: email },
  });

  if (!existingUser) {
    return res
      .status(400)
      .json({ status: false, message: "User not Found", data: [] });
  }

  const resetToken = generateToken().toString();
  const fifTeenMinutes = 1000 * 60 * 15;
  const resetTokenExpiry = new Date(Date.now() + fifTeenMinutes);

  const emailHtml = generateEmail(resetToken);

  const emailSent = await sendEmail(email, emailHtml);

  if (!emailSent) {
    return res.status(501).json({
      status: false,
      message: "Email not sent, an error occurred",
      data: [],
    });
  }

  const storeResetToken = await User.update(
    { resetToken, resetTokenExpiry },
    { where: { email: email } }
  );

  if (!storeResetToken) {
    return res.status(500).json({
      status: false,
      message: "Could not store reset token",
      data: [],
    });
  }

  res.status(200).json({
    status: "success",
    message: `Email sent Successfully to ${email}`,
    data: [],
  });
};

const verifyResetToken = async (req, res) => {
  const { email, resetToken } = req.body;

  const existingUser = await User.findOne({
    where: {
      email,
      resetToken,
      resetTokenExpiry: { [Op.gte]: new Date() },
    },
    attributes: { email: true },
  });

  if (!existingUser) {
    return res
      .status(404)
      .json({ status: false, message: "Invalid User or Token", data: [] });
  }

  res
    .status(200)
    .json({ status: true, message: "Token verified successfully", data: null });
};

const changePassword = async (req, res) => {
  const { newPassword, resetToken, email } = req.body;

  const existingUser = await User.findOne({
    where: {
      email,
      resetToken,
      resetTokenExpiry: { [Op.gte]: new Date() },
    },
    attributes: { id: true },
  });

  if (!existingUser) {
    return res
      .status(404)
      .json({ status: false, message: "Invalid User or Token", data: [] });
  }

  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  const passwordChanged = await User.update(
    { password: hashedPassword },
    { where: { id: existingUser.id } }
  );

  if (!passwordChanged) {
    return res.status(500).json({
      status: false,
      message: "Could not save password",
      data: [],
    });
  }

  const deleteResetToken = await User.update(
    { resetToken: null, resetTokenExpiry: null },
    { where: { id: existingUser.id } }
  );

  if (!deleteResetToken) {
    return res.status(500).json({
      status: false,
      message: "Failed to delete reset tokens",
      data: [],
    });
  }

  res
    .status(200)
    .json({ status: true, message: "Password updated successfully", data: [] });
};

export {
  register,
  login,
  logOut,
  forgotPassword,
  verifyResetToken,
  changePassword,
};
