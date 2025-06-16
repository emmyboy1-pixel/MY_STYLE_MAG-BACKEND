import CustomAPIErrorResponse from "./custom.error.js";

class BadRequestErrorResponse extends CustomAPIErrorResponse {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

export default BadRequestErrorResponse;
