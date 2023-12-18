import { DE_AUTH } from 'src/configuration';

export class AuthFactory {
  static async getAccessToken() {
    let authResponse;
    await fetch(DE_AUTH.authTokenUrl, {
      method: 'POST',
      body: `grant_type=client_credentials&client_id=${DE_AUTH.clientId}&client_secret=${DE_AUTH.clientSecret}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .then((response) => response.json())
      .then((data) => {
        authResponse = data;
      });
    return `Bearer ${authResponse.access_token} `;
  }
}
