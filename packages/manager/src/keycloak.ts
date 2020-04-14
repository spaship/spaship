import Keycloak from "keycloak-js";
import config from "./config";

/**
 * Interface for the JWT SPAship expects to receive from keycloak.
 */
export interface ISPAshipJWT extends Keycloak.KeycloakTokenParsed {
  name: string;
  email: string;
  role: string[];
}

// Keycloak.KeycloakInstance

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const keycloak = Keycloak(config?.keycloak);

function getUserToken() {
  return keycloak.tokenParsed as ISPAshipJWT;
}

function getEncodedUserToken() {
  return keycloak.token;
}

export { keycloak, getUserToken, getEncodedUserToken };
