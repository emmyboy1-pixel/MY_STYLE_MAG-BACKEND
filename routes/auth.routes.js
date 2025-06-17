import express from "express";
import {
  register,
  login,
  logOut,
  forgotPassword,
  verifyResetToken,
  changePassword,
} from "../controllers/auth.controller.js";
import { authenticateUser } from "../middleware/authentication.js";
import validateRequestHandler from "../middleware/validation.js";
import {
  validateEmail,
  validateName,
  validatePassword,
  validateRole,
} from "../utils/validator/validators.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  [validateName, validateEmail, validatePassword, validateRole],
  validateRequestHandler,
  register
);
authRouter.post("/login", [validateEmail], validateRequestHandler, login);
authRouter.post("/logout", authenticateUser, logOut);
authRouter.post(
  "/forgotPassword",
  [validateEmail],
  validateRequestHandler,
  forgotPassword
);
authRouter.post(
  "/verifyResetToken",
  [validateEmail],
  validateRequestHandler,
  verifyResetToken
);
authRouter.post(
  "/changePassword",
  [validatePassword, validateEmail],
  validateRequestHandler,
  changePassword
);

export default authRouter;
