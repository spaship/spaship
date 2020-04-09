class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.status = "fail";
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
