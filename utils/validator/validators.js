import { body, param } from "express-validator";

export const validateName = body("name")
  .trim()
  .notEmpty()
  .withMessage("Name is required")
  .trim()
  .isLength({ min: 2, max: 50 })
  .withMessage("Name must be between 2 and 50 characters");

export const validateEmail = body("email")
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Invalid email format")
  .normalizeEmail();

export const validatePassword = body("password")
  .trim()
  .notEmpty()
  .withMessage("Password is required")
  .isLength({ min: 6 })
  .withMessage("Password must be at least 6 characters long")
  .matches(/[A-Z]/)
  .withMessage("Password must contain at least one uppercase letter")
  .matches(/[0-9]/)
  .withMessage("Password must contain at least one number")
  .matches(/[!@#$%^&*(),.?":{}|<>]/)
  .withMessage("Password must contain at least one special character");

export const validateRole = body("role")
  .optional()
  .trim()
  .isIn(["admin", "user"])
  .withMessage("Role must be either 'admin' or 'user'");

export const validateBlogPost = [
  body("title").notEmpty().withMessage("Title is required"),
  body("content").notEmpty().withMessage("Content is required"),
  body("status")
    .isIn(["Draft", "Archived", "Pending", "Published"])
    .withMessage("Invalid status"),
  body("categoryId").notEmpty().withMessage("Category ID is required"),
];

export const validateOutfit = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Content is required"),
  body("categoryId").notEmpty().withMessage("Category ID is required"),
];

export const validateId = body("outfitId")
  .notEmpty()
  .withMessage("Outfit ID is required for this route");
