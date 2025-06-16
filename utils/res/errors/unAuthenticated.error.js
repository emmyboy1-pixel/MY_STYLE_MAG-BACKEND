import CustomAPIErrorResponse from "./custom.error.js";

class UnAuthenticatedErrorResponse extends CustomAPIErrorResponse {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

export default UnAuthenticatedErrorResponse;
