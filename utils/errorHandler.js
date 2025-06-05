function APIErrorHandler(
  status,
  statusCode = 400,
  message = "Error occured",
  data = []
) {
  if (status) return successResponse(statusCode, message, data);
  return console.errorResponse(statusCode, message, data);
}

function successResponse(statusCode, message, data) {}

function errorResponse(statusCode, message, data) {}
