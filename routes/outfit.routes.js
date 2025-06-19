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
import upload from "../middleware/multer.js";

const outfitRouter = express.Router();

outfitRouter.use(authenticateUser);

outfitRouter
  .route("/")
  .get(getAllOutfits)
  .post(
    checkAuthorizedPermissions("admin"),
    upload.array("image", 10),
    createOutfit
  );

outfitRouter
  .route("/:id")
  .get(getSingleOutfit)
  .patch(
    checkAuthorizedPermissions("admin"),
    upload.array("image", 10),
    updateOutfit
  )
  .delete(checkAuthorizedPermissions("admin"), deleteOutfit);

export default outfitRouter;
