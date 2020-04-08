class NotImplementedError extends Error {
  constructor(message = "This feature is not implemented") {
    super(message);
    this.name = "NotImplemented";
    this.status = "error";
    this.statusCode = 501;
  }
}

module.exports = NotImplementedError;
