import { KeycloakInstance, KeycloakProfile } from "keycloak-js";
import { ISPAshipJWT } from "../keycloak";

/**
 * This is the starting point for a mock Keycloak client to use for automated testing and perhaps local development.  It
 * isn't yet fully compatible with KeycloakProvider, but with a little more work it could be.
 */

class MockKeycloak implements KeycloakInstance<"native"> {
  authenticated = true;
  token = "mocktoken";
  tokenParsed: ISPAshipJWT = { name: "Mock User", email: "mock@spaship.io", role: [] };

  async init() {
    this.onReady();
    return true;
  }

  onReady() {}

  async login() {}
  async logout() {}
  async register() {}
  async accountManagement() {}
  createLoginUrl() {
    return "";
  }
  createLogoutUrl() {
    return "";
  }
  createRegisterUrl() {
    return "";
  }
  createAccountUrl() {
    return "";
  }
  isTokenExpired() {
    return false;
  }
  async updateToken(n: number) {
    console.log(n);
    return true;
  }
  clearToken() {}
  hasRealmRole(s: string) {
    return !!s;
  }
  hasResourceRole(s: string) {
    return !!s;
  }
  async loadUserProfile() {
    return {} as KeycloakProfile;
  }
  async loadUserInfo() {
    return {} as KeycloakProfile;
  }
}

const keycloak = new MockKeycloak();

function getUserToken() {
  return keycloak.tokenParsed as ISPAshipJWT;
}

export { keycloak, getUserToken };
