const jwt = require("express-jwt");
const { log } = require("@spaship/common/lib/logging/pino");
const { readFileSync } = require("fs");
const config = require("../config");

function getKeycloakPublicKey() {
  let key = "";
  try {
    key = readFileSync(config.get("auth:keycloak:pubkey_file"));
  } catch (e) {
    log.error(e);
  }
  return key.toString().trim();
}

function handleError(err, req, res, next) {
  req.user = req.user || {};
  req.user.error = err;
}

function createJwtMiddleware({ credentialsRequired = false } = {}) {
  // credentialsRequired is false because we don't want to send 401/403 from this middeleware.  we send it from
  // authMiddleware later down the chain.
  return [
    jwt({
      secret: getKeycloakPublicKey(),
      credentialsRequired
    }),
    handleError
  ];
}

module.exports = createJwtMiddleware;
