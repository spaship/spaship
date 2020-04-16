class NotImplementedError extends Error {
  constructor(message = "This feature is not yet implemented") {
    super(message);
    this.name = "NotImplemented";
    this.status = "error";
    this.statusCode = 501;
  }
}

module.exports = NotImplementedError;
