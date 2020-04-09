class DeployError extends Error {
  constructor(message) {
    super(message);
    this.name = "DeployError";
    this.status = "fail";
    this.statusCode = 400;
  }
}

module.exports = DeployError;
