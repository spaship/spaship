// Configure pino (https://github.com/pinojs/pino and https://github.com/pinojs/pino-pretty) and export, so each SPAship
// package can use the same logger.

const isProduction = process.env.NODE_ENV !== "production";

const pinoOptions = {
  prettyPrint: isProduction && { translateTime: true }
};

const logger = require("pino")(pinoOptions);
const pinoExpress = require("express-pino-logger")(pinoOptions);

module.exports = {
  logger,
  pinoExpress
};
