import { IAuthService } from "../../models/Auth";

/**
 * This AuthService says yes to everything and needs no SSO provider.  Use for testing and local development.
 */
class MockAuth implements IAuthService {
  name: string;

  constructor() {
    this.name = "mock";
  }
  async init(...args: any[]) {
    return this;
  }
  async login() {}
  async logout() {}
  isAuthenticated() {
    return true;
  }
  hasRole(role: string) {
    console.log(`checking to see if user has role ${role}`);
    return true;
  }
  getUserData() {}
}
