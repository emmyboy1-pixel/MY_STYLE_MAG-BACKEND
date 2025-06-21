import multer from "multer";
import { fileURLToPath } from "url";
import path from "path";
import { v4 as uuidV4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store uploaded files temporarily in 'uploads/' directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/")); // this is a temporary storage location
  },
  filename: function (req, file, cb) {
    cb(null, uuidV4() + path.extname(file.originalname));
  },
});

// Optional: file filter (e.g. images only)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Create and export multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});
export default upload;
