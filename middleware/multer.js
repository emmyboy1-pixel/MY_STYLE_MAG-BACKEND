import multer from 'multer';

// Store uploaded files temporarily in 'uploads/' directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // this is a temporary storage location
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Optional: file filter (e.g. images only)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create and export multer instance
const upload = multer({ storage, fileFilter });
export default upload;