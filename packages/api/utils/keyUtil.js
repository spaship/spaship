const { readFileSync } = require("fs");
const path = require("path");
const config = require("../config");
const { log } = require("@spaship/common/lib/logging/pino");

const formatAsPem = (str) => {
  const keyHeader = "-----BEGIN PUBLIC KEY-----";
  const keyFooter = "-----END PUBLIC KEY-----";
  let formatKey = "";
  if (str.startsWith(keyHeader) && str.endsWith(keyFooter)) {
    return str;
  }

  if (str.split("\n").length == 1) {
    while (str.length > 0) {
      formatKey += `${str.substring(0, 64)}\n`;
      str = str.substring(64);
    }
  }

  return `${keyHeader}\n${formatKey}${keyFooter}`;
};

const getPublicKey = () => {
  const publicKey = config.get("auth:keycloak:pubkey");

  if (publicKey && publicKey.trim().length > 0) {
    return formatAsPem(publicKey);
  }
  const publicKeyPath = config.get("auth:keycloak:pubkey_file");
  if (publicKeyPath && publicKeyPath.trim().length > 0) {
    try {
      return formatAsPem(readFileSync(publicKeyPath).toString().trim());
    } catch (error) {
      log.error(error);
    }
  }
  throw Error("No Keycloak Public Key can be found!, Please configure it");
};

module.exports = {
  getPublicKey,
  formatAsPem,
};
