class UnknownError extends Error {
  constructor(error) {
    super(error.stack);
    this.name = "UnknownError";
    this.status = "error";
    this.statusCode = 500;
  }
}

module.exports = UnknownError;
