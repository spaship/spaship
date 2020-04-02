class APIKeyError extends Error {
  constructor(message) {
    super(message);
    this.name = "APIKeyError";
    this.status = "fail";
    this.statusCode = 401;
  }
}

module.exports = APIKeyError;
