import express from "express";
import { deleteUser, getAllUsers } from "../controllers/user.controller.js";
import {
  authenticateUser,
  checkAuthorizedPermissions,
} from "../middleware/authentication.js";

const userRouter = express.Router();

userRouter.use(authenticateUser);

userRouter.get("/", checkAuthorizedPermissions("admin"), getAllUsers);

userRouter.delete("/:id", checkAuthorizedPermissions("admin"), deleteUser);

export default userRouter;
