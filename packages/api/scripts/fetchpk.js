const fs = require("fs");

const { get } = require("axios");
const _ = require("lodash");

const config = require("../config");

const PUBKEY_HEADER = "-----BEGIN PUBLIC KEY-----";
const PUBKEY_FOOTER = "-----END PUBLIC KEY-----";

const url = `${config.get("auth:keycloak:url")}/auth/realms/${config.get("auth:keycloak:realm")}`;
const fileName = `${config.get("auth:keycloak:url")}_${config.get("auth:keycloak:realm")}`
  .replace(/^https?:\/\//, "")
  .replace(/[\./]/g, "_");

function getResponseJson(res) {
  return res.data;
}

function savePubKey(url) {
  return function (json) {
    fs.writeFileSync(`${fileName}.key`, PUBKEY_HEADER + "\n" + json.public_key.trim() + "\n" + PUBKEY_FOOTER);
    console.log(`pubkey saved to file ${fileName}`);
  };
}

function networkErrorHandler(err) {
  throw err;
}

function fetchAndSavePubKey(url) {
  get(url).then(getResponseJson).then(savePubKey(url)).catch(networkErrorHandler);
}

fetchAndSavePubKey(url);
