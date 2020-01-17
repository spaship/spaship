// Configure pino (https://github.com/pinojs/pino and https://github.com/pinojs/pino-pretty) and export, so each SPAship
// package can use the same logger.

const log = require("pino")();
const pinoExpress = require("express-pino-logger")();

module.exports = {
  log,
  pinoExpress
};
