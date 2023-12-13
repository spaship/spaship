export const DIRECTORY_CONFIGURATION = {
  baseDir: './spaship_uploads'
};

export const EPHEMERAL_ENV = {
  expiresIn: process.env.SPASHIP_EPH__TTL || 3600,
  maximumDuration: process.env.SPASHIP_EPH__MAX_DURATION || 500
};

export const CONTAINERIZED_DEPLOYMENT_DETAILS = {
  port: 3000,
  configSecret: process.env.SPASHIP_CONFIG_SECRET || 'spashipWorkflowSecret'
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
  const spashipMongoUrl = process.env.SPASHIP_DB__MONGO__URL || 'localhost:27017/spaship';
  return `mongodb://${spashipMongoUrl}`;
}

export const GIT_AUTH = {
  secret: process.env.SPASHIP_GIT__SECRET
};

export const DATA_BASE_CONFIGURATION = {
  mongoConnectionString: getDatabaseConfiguration()
};
export const ALLOWED_ORIGIN = {
  hosts: getAllowedOrigins()
};

function getAllowedOrigins() {
  const hosts = process.env.SPASHIP_ALLOWED_ORIGINS;
  if (hosts) return hosts.split(',');
  return ['http://localhost:2468'];
}

export const AUTH_LISTING = {
  deploymentBaseURL: '/api/v1/applications/deploy',
  eventsBaseURL: '/api/v1/analytics/events',
  propertyBaseURL: '/api/v1/property',
  gitDeploymentBaseURL: '/api/v1/applications/git/deploy',
  gitEnvListBaseURL: '/api/v1/environment/git',
  hourSavedAnalyticsBaseURL: '/api/v1/analytics/deployment/time-saved'
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
  type: {
    containerized: 'containerized',
    static: 'static'
  },
  namespace: process.env.SPASHIP_NAMESPACE_PREFIX || 'spaship-sandbox',
  severity: getSeverity()
};

function getSeverity() {
  const severities = process.env.SPASHIP_SEVERITY;
  if (severities) return severities.split(',');
  return ['C1', 'C2'];
}

// @internal this is for validating the minimum length for the Specific requests
export enum MIN {
  DEFAULT = 2,
  PATH = 1,
  ACTIONID = 1,
  URL = 3,
  EPH_EXPIRESIN = 1
}

// @internal this is for validating the maximum length for the Specific requests
export enum MAX {
  PATH = 100,
  NAME = 100,
  DEFAULT = 100,
  PROPERTY = 50,
  EXPIRESIN = 6,
  ENV = 15,
  REF = 500,
  CLUSTER = 12,
  EPH_EXPIRESIN = 3
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
  INVALID_FOLDER = 'Invalid Folder [Please provide a valid folder path]',
  INVALID_ENV = 'Invalid Environment [Correct format : prod, stage, dev]',
  INVALID_LABEL = 'Invalid Label [Correct format : all-access, prod-key].',
  INVALID_IMAGEURL = 'Invalid Image URL. Please check the image url',
  INVALID_EPHEXPIRESIN = 'The duration for the Ephemeral Environment must be a natural number between 1 and 500 hours.',
  INVALID_CMDB_CODE = 'Invalid CMDB Code.',
  INVALID_SEVERITY = 'Invalid Severity.'
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
  CMDB: /^[a-zA-Z0-9-]+$/,
  IMAGEURL: getImageUrlRegex(),
  EPH_EXPIRESIN: /^[0-9]+$/,
  FOLDER: /^[_.a-zA-Z0-9/-]+$/
};

export enum JOB {
  DELETE_EPH_ENV = 'DELETE_EPH_ENV'
}

export enum LOGTYPE {
  DEPLOYMENT = 'DEPLOYMENT',
  BUILD = 'BUILD',
  POD = 'POD'
}

export const GLOBAL_PREFIX = '/api/v1';

export enum ENV {
  PRODUCTION = 'PRODUCTION',
  STAGE = 'STAGE',
  DEV = 'DEV',
  QA = 'QA'
}

export const ENV_TYPE = process.env.NODE_ENV;

// @internal It will be auto initiated from package.json - "version"
export const SPASHIP_VERSION = process.env.npm_package_version;

function getImageUrlRegex() {
  return new RegExp(process.env.SPASHIP_SSR_IMAGEURL_REGEX);
}

export const ANALYTICS = {
  averageTimeToDeploy: process.env.SPASHIP_ANALYTICS_AVERAGE_TIME_TO_DEPLOY || 300,
  averageDevelopmentHours: process.env.SPASHIP_ANALYTICS_AVERAGE_DEVELOPMENT_HOURS || 1800,
  developerHourlyRate: process.env.SPASHIP_ANALYTICS_DEVELOPER_HOURLY_RATE || 46,
  workingDays: process.env.SPASHIP_ANALYTICS_WORKING_DAYS || 23,
  workingHours: process.env.SPASHIP_ANALYTICS_WORKING_HOURS || 8
};

export const CMDB_DETAILS = {
  baseUrl: process.env.SPASHIP_CMDB_BASE_URL,
  cred: generateCMDBCred()
};

function generateCMDBCred() {
  const username = process.env.SPASHIP_CMDB_USERNAME;
  const password = process.env.SPASHIP_CMDB_PASSWORD;
  const base64EncodedCreds = Buffer.from(`${username}:${password}`);
  return base64EncodedCreds.toString('base64');
}

export const GIT_BROKER_DETAILS = {
  baseUrl: process.env.SPASHIP_GIT_BROKER_URL,
  cred: process.env.SPASHIP_GIT_BROKER_CRED
};

export enum STATUS {
  BUILD_COMPLETED = 'COMPLETED',
  BUILD_FAILED = 'FAILED',
  BUILD_TERMINATED = 'CHECK_OS_CONSOLE',
  BUILD_TIMEOUT = 'TIMEOUT',
  DEPLOYMENT_READY = 'READY',
  DEPLOYMENT_FAILED = 'ERR',
  DEPLOYMENT_TIMEOUT = 'TIMEOUT'
}

export const CUSTOM_HEADER = { 'User-Agent': process.env.SPASHIP_HEADER__USER_AGENT };


export const LIGHTHOUSE_DETAILS = {
  hostUrl: process.env.SPASHIP_LIGHTHOUSE_HOST_URL,
  ciUrl: process.env.SPASHIP_LIGHTHOUSE_CI_URL,
  ciToken: process.env.SPASHIP_LIGHTHOUSE_CI_TOKEN
};
