import express from "express";
import { renamelookbook } from "../controllers/lookbookController.js";
import { deleteLookbook } from "../controllers/lookbookController.js";
import { createLookbook } from "../controllers/lookbookController.js";
import { getAllLookbooks } from "../controllers/lookbookController.js";

const router = express.Router();

router.post("/users/:userId/lookbooks/:lookbookId", createLookbook);
router.get("/users/:userId/lookbooks/:lookbookId", getAllLookbooks);

// UPDATE lookbook (rename)
router.put("/users/:userId/lookbooks/:lookbookId", renamelookbook);

router.delete("/users/:userId/lookbooks/:lookbookId", deleteLookbook);

export default router;
