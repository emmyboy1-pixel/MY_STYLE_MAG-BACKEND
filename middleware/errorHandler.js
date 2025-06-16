export const errorHandler = (error, req, res, next) => {
  let customError = {
    status: false,
    statusCode: error.statusCode || 500,
    message: error.message || "Something went wrong, please try again.",
  };

  res
    .status(customError.statusCode)
    .json({ status: customError.status, message: customError.message });
};
