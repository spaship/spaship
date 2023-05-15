export const DIRECTORY_CONFIGURATION = {
  baseDir: './spaship_uploads'
};

export const EPHEMERAL_ENV = {
  expiresIn: process.env.SPASHIP_EPH__TTL || 3600
};

export const CONTAINERIZED_DEPLOYMENT_DETAILS = {
  port: 3000
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
  eventsBaseURL: '/api/v1/analytics/events',
  propertyBaseURL: '/api/v1/property',
  gitDeploymentBaseURL: '/api/v1/applications/git/deploy'
};

const ROVER_AUTH_DETAILS = {
  username: process.env.SPASHIP_ROVER_USERNAME,
  password: process.env.SPASHIP_ROVER_PASSWORD
};

function getRoverAuth() {
  const base64EncodedCreds = Buffer.from(`${ROVER_AUTH_DETAILS.username}:${ROVER_AUTH_DETAILS.password}`);
  return base64EncodedCreds.toString('base64');
}

export const ROVER_AUTH = {
  cred: getRoverAuth(),
  baseUrl: process.env.SPASHIP_ROVER_BASE_URL
};

export const DEPLOYMENT_DETAILS = {
  namespace: process.env.SPASHIP_NAMESPACE || 'spaship'
};

// @internal this is for validating the minimum length for the Specific requests
export enum MIN {
  DEFAULT = 2,
  PATH = 1,
  ACTIONID = 1,
  URL = 3
}

// @internal this is for validating the maximum length for the Specific requests
export enum MAX {
  PATH = 100,
  NAME = 100,
  DEFAULT = 100,
  PROPERTY = 50,
  EXPIRESIN = 4,
  ENV = 12,
  REF = 500,
  CLUSTER = 12
}

export enum MESSAGE {
  INVALID_LENGTH = 'Length is Invalid',
  INVALID_PROPERTY_TITLE = 'Invalid Property Title.',
  INVALID_PROPERTY_IDENTIFIER = 'Invalid Property Identifier.',
  INVALID_CLUSTER = 'Invalid Cluster [Must be Prod/Preprod].',
  INVALID_EPHEMREAL = 'Invalid Ephemeral [Must be true/false].',
  INVALID_PATH = 'Invalid Context Path [Special Characters are not allowed other than forward-slash(/) and hyphen(-)].',
  INVALID_HEALTH_CHECK_PATH = 'Invalid Health Check Path [Special Characters are not allowed other than forward-slash(/) and hyphen(-)].',
  INVALID_URL = 'Invalid URL [Correct format : spaship.redhat.com].',
  INVALID_EXPIRESIN = 'Invalid ExpiresIn [Correct format : 1d, 5d, 100d].',
  INVALID_ACTION_ID = 'Invalid Action Id [Special Characters are not allowed other than forward-slash(/), @ and dot(.)].',
  INVALID_APPLICATION = 'Invalid Application name [Correct format : home, doc].',
  INVALID_REF = 'Invalid Reference [Correct format : 1.2, v1@1.2.3].',
  INVALID_ENV = 'Invalid Environment [Correct format : prod, stage, dev]',
  INVALID_LABEL = 'Invalid Label [Correct format : all-access, prod-key].',
  INVALID_IMAGEURL = 'Invalid Image URL.'
}

export const VALIDATION = {
  PROPERTY_TITLE: /^[_a-zA-Z0-9 -]+$/,
  PROPERTY_IDENTIFIER: /^[a-zA-Z0-9-]+$/,
  APPLICATION_NAME: /^[_a-zA-Z0-9 -.]+$/,
  PATH: /^[a-zA-Z0-9/-]+$/,
  CLUSTER: /^[a-zA-Z]+$/,
  EPHEMERAL: /^[a-zA-Z]+$/,
  ACTIONID: /^[a-zA-Z0-9/@-]+$/,
  LABEL: /^[_a-zA-Z0-9 -.]+$/,
  URL: /^[_a-zA-Z0-9-.]+$/,
  ENV: /^[a-zA-Z0-9-]+$/,
  REF: /^[_a-zA-Z0-9/@ -.]+$/,
  EXPIRESIN: /^[a-zA-Z0-9]+$/,
  IMAGEURL: getImageUrlRegex()
};

export enum JOB {
  DELETE_EPH_ENV = 'DELETE_EPH_ENV'
}

export enum LOG {
  DEPLOYMENT = 'DEPLOYMENT',
  BUILD = 'BUILD',
  POD = 'POD'
}

export const GLOBAL_PREFIX = '/api/v1';

function getImageUrlRegex() {
  return new RegExp(process.env.SPASHIP_SSR_IMAGEURL_REGEX);
}
