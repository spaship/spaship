// Configure pino (https://github.com/pinojs/pino and https://github.com/pinojs/pino-pretty) and export, so each SPAship
// package can use the same logger.

const pinoConfig = require("./pino-config");

const pino = require("pino");

const pinoSettings = { level: pino.levels.values[pinoConfig.get("log_level")] };

if (pinoConfig.get("log_format") === "pretty") {
  pinoSettings.prettyPrint = { levelFirst: true };
}

const log = pino(pinoSettings);
const pinoExpress = require("express-pino-logger")({ useLevel: "debug", logger: log });

module.exports = {
  log,
  pinoExpress
};
