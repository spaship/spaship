class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.status = "fail";
    this.statusCode = 400;
  }
}

module.exports = ValidationError;
