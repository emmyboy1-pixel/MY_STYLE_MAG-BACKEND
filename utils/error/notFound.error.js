import CustomAPIErrorResponse from "./custom.error.js";

class NotFoundErrorResponse extends CustomAPIErrorResponse {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

export default NotFoundErrorResponse;
