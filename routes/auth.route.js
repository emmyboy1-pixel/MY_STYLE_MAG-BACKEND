import express from "express";
import {
  register,
  login,
  logOut,
  forgotPassword,
  verifyResetToken,
  changePassword,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/logout", logOut);
authRouter.post("/forgotPassword", forgotPassword);
authRouter.post("/verifyResetToken", verifyResetToken);
authRouter.post("/changePassword", changePassword);

export default authRouter;
