import { validationResult } from "express-validator";
import { UnProcessableEntityErrorResponse } from "../utils/error/index.js";

const validateRequestHandler = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const formattedErrors = {};

    result.array().forEach((error) => {
      if (!formattedErrors[error.path]) {
        formattedErrors[error.path] = [];
      }
      formattedErrors[error.path].push(error.msg);
    });

    if (req.files?.length) {
      await Promise.all(req.files.map((file) => fs.unlink(file.path)));
    }

    throw new UnProcessableEntityErrorResponse(
      `Validation failed: ${JSON.stringify(formattedErrors, null, 2)}`
    );
  }

  next();
};

export default validateRequestHandler;
