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
import validateRequestHandler from "../middleware/validation.js";
import { validateOutfit } from "../utils/validator/validators.js";

const outfitRouter = express.Router();

outfitRouter.use(authenticateUser);

outfitRouter
  .route("/")
  .get(getAllOutfits)
  .post(
    checkAuthorizedPermissions("admin"),
    upload.array("image", 10),
    validateOutfit,
    validateRequestHandler,
    createOutfit
  );

outfitRouter
  .route("/:id")
  .get(getSingleOutfit)
  .patch(
    checkAuthorizedPermissions("admin"),
    upload.array("image", 10),
    validateOutfit,
    validateRequestHandler,
    updateOutfit
  )
  .delete(checkAuthorizedPermissions("admin"), deleteOutfit);

export default outfitRouter;
