import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { sequelize } from "./config/dbConfig.js";
import userRoutes from "./routes/userRoutes.js";
import outfitRoutes from "./routes/outfitRoutes.js";
import lookbookRoutes from "./routes/lookbookRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import authRouter from "./routes/auth.route.js";
import blogPostRouter from "./routes/blogPost.routes.js";
import { authenticateUser } from "./middleware/authentication.js";
import uploadroute from "./routes/uploadroute.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "ui", "api.swagger.json");
const swaggerDocument = JSON.parse(fs.readFileSync(filePath, "utf-8"));

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5501",
  "http://127.0.0.1:5501",
  "http://localhost:5000",
  "http://l27.0.0.1:5000",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
];

function checkCrossOrigin(origin, callback) {
  if (!origin || allowedOrigins.includes(origin)) {
    callback(null, true);
  } else {
    callback(new Error("Not allowed by CORS"));
  }
}

const corsOptions = {
  origin: checkCrossOrigin,
  credentials: true,
};

const app = express();

// simple get request on localhost
app.get("/", (req, res) => {
  res.send("Welcome to the Fashion App API");
});

// middlewares here
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser(process.env.JWT_SECRET));

// Auth test route
app.get("/api/v1/auth", authenticateUser, (req, res) => {
  res.status(200).send("Authentication works perfectly");
});

// API documentation
app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// routes here
app.use("/api/v1", authRouter);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/blog", blogPostRouter);
app.use("/api/users", userRoutes);
app.use("/api/lookbooks", lookbookRoutes);
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
