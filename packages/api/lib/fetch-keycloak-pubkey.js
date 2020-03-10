const axios = require("axios");
const { log } = require("@spaship/common/lib/logging/pino");

let publicKey;

async function getKeycloakPublicKey({ url, realm }) {
  // if public key is not cached, fetch it
  if (!publicKey) {
    try {
      const apiUrl = `${url}/auth/realms/${realm}`;
      const response = await axios.get(apiUrl);
      publicKey = response.data.public_key;
    } catch (e) {
      log.error(e);
    }
  }

  return publicKey;
}

module.exports = getKeycloakPublicKey;
