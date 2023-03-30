import axios from 'axios';
import { env } from './env';

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
  (response) => response,
  (error) => {
    console.error('Error:', error);
    return Promise.reject(error);
  }
);
