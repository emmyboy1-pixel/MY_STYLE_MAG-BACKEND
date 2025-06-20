import express from "express";
import { getAllUsers } from "../controllers/user.controller.js";
import {
  authenticateUser,
  checkAuthorizedPermissions,
} from "../middleware/authentication.js";

const adminRouter = express.Router();

adminRouter.get(
  "/users",
  authenticateUser,
  checkAuthorizedPermissions("admin"),
  getAllUsers
);

export default adminRouter;
