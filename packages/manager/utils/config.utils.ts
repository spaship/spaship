interface Config {
  spashipApiBaseUrl: string;
  spashipApiAuthToken: string;
  spashipGuide: string;
  spashipNotificationTimeout: number;
}

const configs: Config = {
  spashipApiBaseUrl: process.env.SPASHIP_API_BASE_URL || "",
  spashipApiAuthToken: process.env.SPASHIP_API_AUTH_TOKEN || "",
  spashipGuide: process.env.SPASHIP_GUIDE || "",
  spashipNotificationTimeout: 2500,
};

export function getHost() {
  return configs.spashipApiBaseUrl;
}

export function getToken() {
  return configs.spashipApiAuthToken;
}

export function getGuideUrl() {
  return configs.spashipGuide;
}

export function getSpashipNotificationTimeout() {
  return configs.spashipNotificationTimeout;
}
