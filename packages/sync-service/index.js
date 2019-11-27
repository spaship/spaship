#!/usr/bin/env node

const express = require("express");

const { logger, pinoExpress } = require("@spaship/common/lib/logging/pino");
const config = require("./config");
const routes = require("./routes/routes");
const Autosync = require("./lib/background/autosync");
const npmPackage = require("./package.json");

const app = express();
const autosync = new Autosync();

app.use(pinoExpress);

routes.register(app);

app.listen(config.get("port"));

// do fun splash screen when in dev mode.  in production, be boring.
if (process.env.NODE_ENV === "production") {
  logger.info(`Starting SPAship ${npmPackage.version} with the following settings`, config.toString());
} else {
  logger.info(`
███████╗██████╗  █████╗ ███████╗██╗  ██╗██╗██████╗  ██╗
██╔════╝██╔══██╗██╔══██╗██╔════╝██║  ██║██║██╔══██╗ ╚██╗
███████╗██████╔╝███████║███████╗███████║██║██████╔╝  ╚██╗
╚════██║██╔═══╝ ██╔══██║╚════██║██╔══██║██║██╔═══╝   ██╔╝
███████║██║     ██║  ██║███████║██║  ██║██║██║      ██╔╝
╚══════╝╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝      ╚═╝
Starting SPAship version ${npmPackage.version} with configuration:
${config.toString()}
Listening on http://${config.get("host")}:${config.get("port")}`);
}

if (config.get("autosync:enabled")) {
  autosync.start();
  if (config.get("autosync:onstartup")) {
    autosync.forceSyncAll();
  }
}

module.exports = { app, autosync, config, routes };
