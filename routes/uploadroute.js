import express from "express";
import dotenv from "dotenv";
import upload from "../middleware/multer.js";
import { uploadImagesToCloudinary } from "../controllers/uploadImage.controller.js";
dotenv.config();

const uploadroute = express.Router();

uploadroute.post(
  "/upload/:id",
  upload.array("image", 10),
  uploadImagesToCloudinary
);

export default uploadroute;
