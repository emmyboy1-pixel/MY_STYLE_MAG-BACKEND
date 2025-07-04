import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

import { sequelize } from "./config/dbConfig.js";
import outfitRouter from "./routes/outfit.routes.js";
import lookBookRouter from "./routes/lookbook.routes.js";
import categoryRouter from "./routes/category.routes.js";
import authRouter from "./routes/auth.routes.js";
import blogPostRouter from "./routes/blogPost.routes.js";
import { authenticateUser } from "./middleware/authentication.js";
import errorHandler from "./middleware/errorHandler.js";
import userRouter from "./routes/user.routes.js";
import notFound from "./middleware/notFound.js";
import searchRouter from "./routes/search.routes.js";

//TODO: Implement logging

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
  "https://capstone-final-tau.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

const app = express();

app.set("trust proxy", 1);

// simple get request on localhost
app.get("/", (req, res) => {
  res.send("Welcome to the Fashion App API");
});

// middlewares here
app.use(express.json());
app.use(helmet());
app.use(limiter);
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
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/blog", blogPostRouter);
app.use("/api/v1/lookbook", lookBookRouter);
app.use("/api/v1/outfits", outfitRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/search", searchRouter);
app.use(notFound);
app.use(errorHandler);

// syncing database and running port number

sequelize
  .sync({ alter: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to database: ", err);
  });
