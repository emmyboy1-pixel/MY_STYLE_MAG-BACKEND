<<<<<<< HEAD
import express from "express";
import dotenv from "dotenv";
import { sequelize } from "./config/dbConfig.js";
import userRoutes from "./routes/userRoutes.js";
import outfitRoutes from "./routes/outfitRoutes.js";
import lookbookRoutes from "./routes/lookbookRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import { authenticateUser } from "./middleware/authentication.js";
=======
import express from 'express';
import dotenv from 'dotenv';
import upload from './middleware/multer.js';
import cloudinary from './config/cloudinary.js';
import fs from 'fs';
import { sequelize } from './config/dbConfig.js';
import userRoutes from './routes/userRoutes.js';
import outfitRoutes from './routes/outfitRoutes.js';
import lookbookRoutes from './routes/lookbookRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

>>>>>>> a2821a6 (commit message)

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

app.post('/uploads', upload.single('image'), async (req, res) => {
  try {
    const filePath = req.file.path;

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'fashionline',
    });

    //this will Delete the file after it has been uploaded to Cloudinary
    fs.unlinkSync(filePath);

    res.json({
      message: 'Upload successful',
      url: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
});

// middlewares here
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.get("/api/v1/auth", authenticateUser, (req, res) => {
  res.status(200).send("Authentication works perfectly");
});

// routes here
app.use("/api/v1", authRouter);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/lookbooks", lookbookRoutes);
app.use("/api/v1/outfits", outfitRoutes);

// syncing databse and running port number
sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to database: ", err);
  });
