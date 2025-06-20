import express from 'express';
import { getAllUsers } from '../controllers/userController.js';
import { authenticateUser, checkAuthorizedPermissions } from "../middleware/authentication.js";

const adminRouter = express.Router();

router.get("/users", authenticateUser, checkAuthorizedPermissions("admin"), getAllUsers);k

export default adminRouter;