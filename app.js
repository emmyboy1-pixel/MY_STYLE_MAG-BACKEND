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
import cloudinary from './config/cloudinary.js';
import upload from './config/multer.js';
import { sequelize } from './config/dbConfig.js';
import userRoutes from './routes/userRoutes.js';
import outfitRoutes from './routes/outfitRoutes.js';
import lookbookRoutes from './routes/lookbookRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

>>>>>>> a2821a6 (commit message)

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

app.get("/", (req, res) => {
    res.send("Welcome to the Fashion App API");
});
// middlewares here
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

<<<<<<< HEAD
app.get("/api/v1/auth", authenticateUser, (req, res) => {
  res.status(200).send("Authentication works perfectly");
});

=======
>>>>>>> c6b16e1 (commit message)
// routes here
app.use("/api/v1", authRouter);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/users", userRoutes);
<<<<<<< HEAD
app.use("/api/lookbooks", lookbookRoutes);
app.use("/api/v1/outfits", outfitRoutes);

=======
app.use("/api/lookbooks", lookbookRoutes );
app.use("/api/outfits", outfitRoutes);
app.use("/api/upload", uploadRoutes);

app.post('/api/upload', upload.single('image'), (req, res) => {
  cloudinary.uploader.upload(req.file.path, (error, result) => {
    if (error) {
      return res.status(500).json({ error: 'Failed to upload image' });
    }
    res.status(200).json({ url: result.secure_url });
  })
});
>>>>>>> c6b16e1 (commit message)
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
