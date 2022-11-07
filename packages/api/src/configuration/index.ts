export const DATA_BASE_CONFIGURATION = {
  mongoConnectionString: getDatabaseConfiguration()
};


export const DIRECTORY_CONFIGURATION = {
  baseDir: './spaship_uploads'
};

function getDatabaseConfiguration() {
  const SPASHIP_DB__MONGO__URL = process.env.SPASHIP_DB__MONGO__URL || 'localhost:27017/nest';
  return `mongodb://${SPASHIP_DB__MONGO__URL}`;
}

