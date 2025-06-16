const errorHandler = (error, req, res, next) => {
  let customError = {
    status: false,
    statusCode: error.statusCode || 500,
    error:
      error.message ||
      "Internal Server Error. Something went wrong, please try again.",
  };

  res
    .status(customError.statusCode)
    .json({ status: customError.status, message: customError.error });
};

export default errorHandler;
