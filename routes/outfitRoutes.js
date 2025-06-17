import express from "express";
import {
  createOutfit,
  deleteOutfit,
  getAllOutfits,
  getSingleOutfit,
  updateOutfit,
} from "../controllers/outfit.controller.js";
import { authenticateUser } from "../middleware/authentication.js";

const router = express.Router();

router.post("/", authenticateUser, createOutfit);

router.get("/", getAllOutfits);

router.get("/:id", getSingleOutfit);

router.put("/:id", authenticateUser, updateOutfit);

router.delete("/:id", authenticateUser, deleteOutfit);

export default router;
