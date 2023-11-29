import axios from 'axios';
import { env } from './env';

export const feedbackReq = axios.create({
  baseURL: env.PUBLIC_FEEDBACK_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

feedbackReq.interceptors.request.use((config: any) => {
  const modifiedConfig = { ...config };
  modifiedConfig.headers.Authorization = env.PUBLIC_FEEDBACK_TOKEN;
  return modifiedConfig;
});
