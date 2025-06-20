import express from "express";
import {
  addOutfitToLookBook,
  createLookbook,
  deleteLookbook,
  deleteOutfitFromLookBook,
  getAllLookbooks,
  getSingleLookBook,
  updateLookBook,
} from "../controllers/lookbook.controller.js";
import { authenticateUser } from "../middleware/authentication.js";
import validateRequestHandler from "../middleware/validation.js";
import { validateId, validateName } from "../utils/validator/validators.js";

const lookBookRouter = express.Router();

lookBookRouter.use(authenticateUser);

lookBookRouter
  .route("/")
  .get(getAllLookbooks)
  .post([validateName], validateRequestHandler, createLookbook);

lookBookRouter
  .route("/outfit/:id")
  .post([validateId], validateRequestHandler, addOutfitToLookBook)
  .delete(deleteOutfitFromLookBook);

lookBookRouter
  .route("/:id")
  .get(getSingleLookBook)
  .patch([validateName], validateRequestHandler, updateLookBook)
  .delete(deleteLookbook);

export default lookBookRouter;
