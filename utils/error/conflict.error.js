import CustomAPIErrorResponse from "./custom.error.js";

class ConflictErrorResponse extends CustomAPIErrorResponse {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

export default ConflictErrorResponse;
