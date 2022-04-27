import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import KeycloakProvider from "next-auth/providers/keycloak";
import GoogleProvider from "next-auth/providers/google";
import GitlabProvider from "next-auth/providers/gitlab";

async function refreshAccessToken(token: any) {
  try {
    if (Date.now() > token.refreshTokenExpired) throw Error;
    const details = {
      client_id: process.env.SPASHIP_AUTH__KEYCLOAK_ID,
      client_secret: process.env.SPASHIP_AUTH__KEYCLOAK_ISSUER,
      grant_type: ['refresh_token'],
      refresh_token: token.refreshToken,
    };
    const formBody: string[] = [];
    Object.entries(details).forEach(([key, value]: [string, any]) => {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(value);
      formBody.push(encodedKey + '=' + encodedValue);
    });
    const formData = formBody.join('&');
    const url = await process.env.SPASHIP_AUTH__KEYCLOAK_REFRESH_TOKEN_URL || '';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: formData,
    });
    const refreshedTokens = await response.json();
    if (!response.ok) throw refreshedTokens;
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpired: Date.now() + (refreshedTokens.expires_in - 15) * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      refreshTokenExpired:
        Date.now() + (refreshedTokens.refresh_expires_in - 15) * 1000,
    };
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.SPASHIP_AUTH__GITHUB_ID ? process.env.SPASHIP_AUTH__GITHUB_ID : "",
      clientSecret: process.env.SPASHIP_AUTH__GITHUB_SECRET ? process.env.SPASHIP_AUTH__GITHUB_SECRET : "",
    }),
    GitlabProvider({
      clientId: process.env.SPASHIP_AUTH__GITLAB_ID ? process.env.SPASHIP_AUTH__GITLAB_ID : "",
      clientSecret: process.env.SPASHIP_AUTH__GITLAB_SECRET ? process.env.SPASHIP_AUTH__GITLAB_SECRET : "",
    }),
    GoogleProvider({
      clientId: process.env.SPASHIP_AUTH__GOOGLE_ID ? process.env.SPASHIP_AUTH__GOOGLE_ID : "",
      clientSecret: process.env.SPASHIP_AUTH__GOOGLE_SECRET ? process.env.SPASHIP_AUTH__GOOGLE_SECRET : "",
    }),
    KeycloakProvider({
      clientId: process.env.SPASHIP_AUTH__KEYCLOAK_ID ? process.env.SPASHIP_AUTH__KEYCLOAK_ID : "",
      clientSecret: process.env.SPASHIP_AUTH__KEYCLOAK_SECRET ? process.env.SPASHIP_AUTH__KEYCLOAK_SECRET : "",
      issuer: process.env.SPASHIP_AUTH__KEYCLOAK_ISSUER ? process.env.SPASHIP_AUTH__KEYCLOAK_ISSUER : "",
    }),
  ],
  callbacks: {
    jwt: async ({ token, account }) => {
      if (account?.access_token) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpired =
          Date.now() + ((account.expires_at as any) - 15) * 1000;
        token.refreshTokenExpired =
          Date.now() + ((account.refresh_expires_in as any) - 15) * 1000;
        return token;
      }
      if (Date.now() < (token.expiresIn as any)) {
        return token
      }
      return refreshAccessToken(token)
    },
    session: async ({ session, token }) => {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
