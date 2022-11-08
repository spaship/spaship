export const DATA_BASE_CONFIGURATION = {
  mongoConnectionString: getDatabaseConfiguration()
};

export const DIRECTORY_CONFIGURATION = {
  baseDir: './spaship_uploads'
};

export const EPHEMERAL_ENV = {
  expiresIn: process.env.SPASHIP_EPH__TTL || 3600
};

function getDatabaseConfiguration() {
  const SPASHIP_DB__MONGO__URL = process.env.SPASHIP_DB__MONGO__URL || 'localhost:27017/nest';
  return `mongodb://${SPASHIP_DB__MONGO__URL}`;
}
