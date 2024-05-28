/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-param-reassign */
import axios from 'axios';
import { getSession, signIn } from 'next-auth/react'; // signIn is used to refresh session in next-auth
import url from 'url';
import { env } from './env';

// Mutex to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.map((cb) => cb(token));
}

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
    console.error(error);
    return {
      ...token,
      error: 'RefreshAccessTokenError'
    };
  }
}

export const newOrchestratorRequest = () => {
  const req = axios.create({
    baseURL: env.PUBLIC_SPASHIP_ORCHESTRATOR_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      rejectUnauthorized: 'false'
    }
  });

  return {
    req,
    setToken(token: string) {
      req.defaults.headers.common.Authorization = `Bearer ${token}`;
    },
    removeToken() {
      delete req.defaults.headers.common.Authorization;
    }
  };
};

const orchReq = newOrchestratorRequest();
export const orchestratorReq = orchReq.req;
export const setOrchestratorAuthorizationHeader = orchReq.setToken;
export const deleteOrchestratorAuthorizationHeader = orchReq.removeToken;

// Global error handler for axios requests
orchestratorReq.interceptors.response.use(
  async (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        const session = await getSession();
        if (session && session.accessToken) {
          const newToken = await refreshAccessToken(session.accessToken);
          if (newToken.accessToken) {
            // Update the session with the new token
            await signIn('credentials', {
              // signIn refreshes the session with the new token
              accessToken: newToken.accessToken,
              refreshToken: newToken.refreshToken
            });

            // Apply the new token to all pending subscribers
            onRefreshed(newToken.accessToken);

            // Set the new token for subsequent requests
            setOrchestratorAuthorizationHeader(newToken.accessToken);
            isRefreshing = false;
            refreshSubscribers = [];
          } else {
            isRefreshing = false;
            refreshSubscribers = [];
            return Promise.reject(error);
          }
        }
      }

      // Wait for the new token and retry the original request
      return new Promise((resolve) => {
        subscribeTokenRefresh((token: string) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          resolve(axios(originalRequest));
        });
      });
    }
    return Promise.reject(error);
  }
);
