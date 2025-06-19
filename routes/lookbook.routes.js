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

const lookBookRouter = express.Router();

lookBookRouter.use(authenticateUser);

lookBookRouter.route("/").get(getAllLookbooks).post(createLookbook);

lookBookRouter
  .route("/outfit/:id")
  .post(addOutfitToLookBook)
  .delete(deleteOutfitFromLookBook);

lookBookRouter
  .route("/:id")
  .get(getSingleLookBook)
  .patch(updateLookBook)
  .delete(deleteLookbook);

export default lookBookRouter;
