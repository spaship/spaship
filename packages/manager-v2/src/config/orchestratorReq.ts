import axios from 'axios';
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
