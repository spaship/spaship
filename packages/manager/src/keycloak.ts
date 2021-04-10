import Keycloak from "keycloak-js";
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
const options = {
  url: process.env.NODE_ENV === "production" ? "https://auth.redhat.com/auth" : "https://auth.stage.redhat.com/auth",
  realm: "EmployeeIDP",
  clientId: "spaship-reference",
};

const keycloak = Keycloak(options);

(window as any).kc = keycloak;

function getUserToken() {
  return keycloak.tokenParsed as ISPAshipJWT;
}

function getEncodedUserToken() {
  return keycloak.token;
}

export { keycloak, getUserToken, getEncodedUserToken };
