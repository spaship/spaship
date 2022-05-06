class Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthorizationError";
    this.status = "fail";
    this.statusCode = 401;
  }
}

module.exports = Unauthorized;
