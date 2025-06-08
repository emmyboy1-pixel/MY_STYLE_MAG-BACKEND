import express from 'express';
import dotenv from 'dotenv';
import { sequelize } from "./config/dbConfig.js";
import userRoutes from "./routes/userRoutes.js";
import outfitRoutes from "./routes/outfitRoutes.js";
import lookbookRoutes from "./routes/lookbookRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import { authenticateUser } from "./middleware/authentication.js";
import uploadroute from './routes/uploadroute.js';


dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
//simple get request on local host
app.get("/", (req, res) => {
    res.send("Welcome to the Fashion App API");
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
app.use("/api/lookbooks", lookbookRoutes );
app.use("/api/outfits", outfitRoutes);
app.use("/api/lookbooks", lookbookRoutes);
app.use("/api/v1/outfits", outfitRoutes);
app.use("/api/upload", uploadroute); 

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
