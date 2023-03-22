import axios, { AxiosError } from 'axios';
import Router from 'next/router';
import { env } from './env';

export const orchestratorReq = axios.create({
  baseURL: env.PUBLIC_SPASHIP_ORCHESTRATOR_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    rejectUnauthorized: 'false'
  }
});

export const setOrchestratorAuthorizationHeader = (token: string) => {
  orchestratorReq.defaults.headers.common.Authorization = `Bearer ${token}`;
};

// TODO(akhilmhdh): change this to static function and persistence, will be done by akhilmhdh
orchestratorReq.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      delete orchestratorReq.defaults.headers.common.Authorization;
      return Router.push('/login');
    }
    return Promise.reject(error);
  }
);

// Global error handler for axios requests
orchestratorReq.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error:', error);
    return Promise.reject(error);
  }
);
