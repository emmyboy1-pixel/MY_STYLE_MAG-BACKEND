import express from 'express';
import dotenv from 'dotenv';
import cloudinary from './config/cloudinary.js';import fs from 'fs';
import { sequelize } from './config/dbConfig.js';
import userRoutes from './routes/userRoutes.js';
import outfitRoutes from './routes/outfitRoutes.js';
import lookbookRoutes from './routes/lookbookRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';


dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

app.get("/", (req, res) => {
    res.send("Welcome to the Fashion App API");
});
// middlewares here
app.use(express.json());

// routes here
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
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
// syncing databse and running port number
sequelize.sync({ alter: true}).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    })
}).catch((err) => {
    console.error("Error connecting to database: ", err);
})

