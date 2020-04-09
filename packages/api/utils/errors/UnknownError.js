class UnknownError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnknownError";
    this.status = "error";
    this.statusCode = 500;
  }
}

module.exports = UnknownError;
