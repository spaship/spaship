const crypto = require("crypto");

module.exports.encrypt = (str) => {
  return crypto.createHash("sha256").update(str).digest("hex");
};
