export const DIRECTORY_CONFIGURATION = {
  baseDir: './spaship_uploads'
};

export const EPHEMERAL_ENV = {
  expiresIn: process.env.SPASHIP_EPH__TTL || 3600
};

export const AUTH_DETAILS = {
  url: process.env.SPASHIP_AUTH__KEYCLOAK__URL,
  realm: process.env.SPASHIP_AUTH__KEYCLOAK__REALM,
  pubkey: process.env.SPASHIP_AUTH__KEYCLOAK__PUBKEY,
  id_prop: process.env.SPASHIP_AUTH__KEYCLOAK__ID_PROP
};

export const DE_AUTH = {
  clientId: process.env.SPASHIP_DE__CLIENT__ID,
  clientSecret: process.env.SPASHIP_DE__CLIENT__SECRECT,
  authTokenUrl: process.env.SPASHIP_DE__AUTH_TOKEN__URL
};

function getDatabaseConfiguration() {
  const spashipMongoUrl = process.env.SPASHIP_DB__MONGO__URL || 'localhost:27017/nest';
  return `mongodb://${spashipMongoUrl}`;
}

export const DATA_BASE_CONFIGURATION = {
  mongoConnectionString: getDatabaseConfiguration()
};

export const AUTH_LISTING = {
  deploymentBaseURL: '/api/v1/applications/deploy',
  eventsBaseURL: '/api/v1/analytics/events'
};

export enum MIN {
  DEFAULT = 2,
  PATH = 1,
  ACTIONID = 1,
  URL = 3
}

export enum MAX {
  DEFAULT = 36,
  PROPERTY = 24,
  EXPIRESIN = 4,
  ENV = 12,
  CLUSTER = 12
}

export enum MESSAGE {
  INVALID_LENGTH = 'Length is Invalid.',
  INVALID_PROPERTY_TITLE = 'Invalid Property Title.',
  INVALID_PROPERTY_IDENTIFIER = 'Invalid Property Identifier.',
  INVALID_CLUSTER = 'Invalid Cluster [Must be Prod/Preprod].',
  INVALID_EPHEMREAL = 'Invalid Ephemeral [Must be true/false].',
  INVALID_PATH = 'Invalid Path [Example : /home, /test-app].',
  INVALID_URL = 'Invalid URL [Example : spaship.redhat.com].',
  INVALID_EXPIRESIN = 'Invalid ExpiresIn [Example : 1d, 5d, 100d].',
  INVALID_ACTION_ID = 'Invalid Action Id [Please provide the Pull Request ID, Ex: 101].',
  INVALID_APPLICATION = 'Invalid Application name.',
  INVALID_REF = 'Invalid Reference.',
  INVALID_ENV = 'Invalid Environment',
  INVALID_LABEL = 'Invalid Label.'
}

export const VALIDATION = {
  PROPERTY_TITLE: /^[_a-zA-Z0-9 -]+$/,
  PROPERTY_IDENTIFIER: /^[a-zA-Z0-9-]+$/,
  APPLICATION_NAME: /^[_a-zA-Z0-9 -.]+$/,
  PATH: /^[_a-zA-Z0-9/-]+$/,
  CLUSTER: /^[a-zA-Z]+$/,
  EPHEMERAL: /^[a-zA-Z]+$/,
  ACTIONID: /^[_a-zA-Z0-9@ -]+$/,
  LABEL: /^[_a-zA-Z0-9 -.]+$/,
  URL: /^[_a-zA-Z0-9-.]+$/,
  ENV: /^[a-zA-Z0-9-]+$/,
  REF: /^[_a-zA-Z0-9/ -.]+$/,
  EXPIRESIN: /^[a-zA-Z0-9]+$/
};

export enum JOB {
  DELETE_EPH_ENV = 'DELETE_EPH_ENV'
}
