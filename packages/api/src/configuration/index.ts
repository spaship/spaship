export const DATA_BASE_CONFIGURATION = {
  mongoConnectionString: process.env.SPASHIP_DB__MONGO__URL || 'mongodb://localhost:27017/nest'
};

export const DIRECTORY_CONFIGURATION = {
  baseDir: './spaship_uploads'
};
