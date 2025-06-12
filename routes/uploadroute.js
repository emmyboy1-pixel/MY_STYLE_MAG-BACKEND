import express from "express";
import dotenv from "dotenv";
import cloudinary from "../config/cloudinary.js";
import upload from "../middleware/multer.js";
import { uploadImagesToCloudinary } from "../controllers/uploadImage.controller.js";
dotenv.config();

// const uploadroute = express.Router();

// uploadroute.post("/", upload.single('image'), (req, res) => {
//   cloudinary.uploader.upload(req.file.path, (error, result) => {
//     if (error) {
//       return res.status(500).json({ error: 'Failed to upload image' });
//     }
//     res.status(200).json({ url: result.secure_url });
//   })
// });
// export default uploadroute;

const uploadroute = express.Router();

uploadroute.post(
  "/upload/:id",
  upload.array("image", 10),
  uploadImagesToCloudinary
);

export default uploadroute;
