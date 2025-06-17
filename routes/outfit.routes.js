import express from "express";
import {
  createOutfit,
  deleteOutfit,
  getAllOutfits,
  getSingleOutfit,
  updateOutfit,
} from "../controllers/outfit.controller.js";
import { authenticateUser } from "../middleware/authentication.js";

const outfitRouter = express.Router();

outfitRouter.use(authenticateUser);

outfitRouter.route("/").get(getAllOutfits).post(createOutfit);

outfitRouter
  .route("/:id")
  .get(getSingleOutfit)
  .patch(updateOutfit)
  .delete(deleteOutfit);

export default outfitRouter;
