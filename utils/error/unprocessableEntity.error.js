import CustomAPIErrorResponse from "./custom.error.js";

class UnProcessableEntityErrorResponse extends CustomAPIErrorResponse {
  constructor(message) {
    super(message);
    this.statusCode = 422;
  }
}

export default UnProcessableEntityErrorResponse;
