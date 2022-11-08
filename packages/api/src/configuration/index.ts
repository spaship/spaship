export const DATA_BASE_CONFIGURATION = {
  mongoConnectionString: getDatabaseConfiguration()
};

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
  clientid: process.env.SPASHIP_AUTH__KEYCLOAK__CLIENTID,
  id_prop: process.env.SPASHIP_AUTH__KEYCLOAK__ID_PROP
};

function getDatabaseConfiguration() {
  const SPASHIP_DB__MONGO__URL = process.env.SPASHIP_DB__MONGO__URL || 'localhost:27017/nest';
  return `mongodb://${SPASHIP_DB__MONGO__URL}`;
}
