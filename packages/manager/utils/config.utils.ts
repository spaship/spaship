interface Config {
  spashipApiBaseUrl: string;
  spashipApiAuthToken: string;
}

const configs: Config = {
  spashipApiBaseUrl: process.env.SPASHIP_API_BASE_URL || '',
  spashipApiAuthToken: process.env.SPASHIP_API_AUTH_TOKEN || '',
}

export function getHost() {
  return configs.spashipApiBaseUrl;
}

export function getToken() {
  return configs.spashipApiAuthToken;
}
