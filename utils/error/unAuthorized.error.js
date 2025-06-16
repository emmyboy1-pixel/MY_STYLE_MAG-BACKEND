import CustomAPIErrorResponse from "./custom.error.js";

class UnAuthorizedErrorResponse extends CustomAPIErrorResponse {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

export default UnAuthorizedErrorResponse;
