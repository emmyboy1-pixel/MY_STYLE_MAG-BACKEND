import express from "express";
import {
  createOutfit,
  deleteOutfit,
  getAllOutfits,
  getSingleOutfit,
  updateOutfit,
} from "../controllers/outfit.controller.js";
import {
  authenticateUser,
  checkAuthorizedPermissions,
} from "../middleware/authentication.js";

const outfitRouter = express.Router();

outfitRouter.use(authenticateUser);

outfitRouter
  .route("/")
  .get(getAllOutfits)
  .post(checkAuthorizedPermissions("admin"), createOutfit);

outfitRouter
  .route("/:id")
  .get(getSingleOutfit)
  .patch(checkAuthorizedPermissions("admin"), updateOutfit)
  .delete(checkAuthorizedPermissions("admin"), deleteOutfit);

export default outfitRouter;
