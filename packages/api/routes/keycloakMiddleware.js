// include auth stuff
const Keycloak = require("keycloak-connect");
const session = require("express-session");
const { log } = require("@spaship/common/lib/logging/pino");

const config = require("../config");
const getKeycloakPublicKey = require("../lib/fetch-keycloak-pubkey");

const kcConfig = {
  clientId: config.get("auth:keycloak:clientid"),
  bearerOnly: true,
  serverUrl: config.get("auth:keycloak:url"),
  realm: config.get("auth:keycloak:realm"),
  realmPublicKey: null
};

const memoryStore = new session.MemoryStore();
let keycloak;

/**
 * The first middleware function fetches the Keycloak public key, which we'll use to validate JWTs.
 */
function keycloakPublicKeyMiddleware() {
  return async function(req, res, next) {
    // if the realmPublicKey hasn't been fetched yet, fetch and cache it for future requests
    if (kcConfig.realmPublicKey == null) {
      const url = config.get("auth:keycloak:url");
      const realm = config.get("auth:keycloak:realm");

      const publicKey = await getKeycloakPublicKey({ url, realm });

      log.info(`fetched and cached keycloak publicKey from ${url}: ${publicKey.slice(0, 20)}...`);

      // save the publicKey in the kcConfig object
      kcConfig.realmPublicKey = publicKey;
    }

    next();
  };
}

function getKeycloak() {
  // create a reusable Keycloak instance
  if (!keycloak) {
    keycloak = new Keycloak({ store: memoryStore }, kcConfig);
  }

  return keycloak;
}

module.exports = {
  keycloak: getKeycloak,
  protect: (...args) => [keycloakPublicKeyMiddleware(), getKeycloak().protect(...args)]
};
