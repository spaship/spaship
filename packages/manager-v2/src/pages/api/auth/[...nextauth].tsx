import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import KeycloakProvider from 'next-auth/providers/keycloak';
import GoogleProvider from 'next-auth/providers/google';
import GitlabProvider from 'next-auth/providers/gitlab';
import axios from 'axios';
import url from 'url';
import { env } from '@app/config/env';

async function refreshAccessToken(token: any) {
  try {
    if (Date.now() > token.refreshTokenExpired) {
      return { ...token, error: 'RefreshAccessTokenError' };
    }

    const params = new url.URLSearchParams({
      client_id: env.SPASHIP_AUTH_KEYCLOAK_ID,
      client_secret: env.SPASHIP_AUTH_KEYCLOAK_SECRET,
      grant_type: 'refresh_token',
      refresh_token: token.refreshToken
    });

    const { data } = await axios.post(
      env.SPASHIP_AUTH_KEYCLOAK_REFRESH_TOKEN_URL,
      params.toString()
    );

    return {
      ...token,
      accessToken: data.access_token,
      accessTokenExpired: Date.now() + (data.expires_in - 15) * 1000,
      refreshToken: data.refresh_token ?? token.refreshToken,
      refreshTokenExpired: Date.now() + (data.refresh_expires_in - 15) * 1000
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return {
      ...token,
      error: 'RefreshAccessTokenError'
    };
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: env.SPASHIP_AUTH_GITHUB_ID,
      clientSecret: env.SPASHIP_AUTH_GITHUB_SECRET
    }),
    GitlabProvider({
      clientId: env.SPASHIP_AUTH_GITLAB_CLIENT_ID,
      clientSecret: env.SPASHIP_AUTH_GITLAB_CLIENT_SECRET
    }),
    GoogleProvider({
      clientId: env.SPASHIP_AUTH_GOOGLE_CLIENT_ID,
      clientSecret: env.SPASHIP_AUTH_GOOGLE_CLIENT_SECRET
    }),
    KeycloakProvider({
      clientId: env.SPASHIP_AUTH_KEYCLOAK_ID,
      clientSecret: env.SPASHIP_AUTH_KEYCLOAK_SECRET,
      issuer: env.SPASHIP_AUTH_KEYCLOAK_ISSUER
    })
  ],
  callbacks: {
    jwt: async ({ token, account }) => {
      if (account?.access_token) {
        const jwt = { ...token };
        jwt.accessToken = account.access_token;
        jwt.refreshToken = account.refresh_token;
        jwt.accessTokenExpired = Date.now() + ((account.expires_at as any) - 15) * 1000;
        jwt.refreshTokenExpired = Date.now() + ((account.refresh_expires_in as any) - 15) * 1000;
        return jwt;
      }
      if (Date.now() < (token.expiresIn as any)) {
        return token;
      }
      return refreshAccessToken(token);
    },
    session: async ({ session, token }) => {
      const sess = { ...session };
      sess.error = token.error;
      sess.accessToken = token.accessToken as string;
      return sess;
    }
  }
});
