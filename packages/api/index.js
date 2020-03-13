#!/usr/bin/env node

const express = require("express");
const bodyParser = require("body-parser");

const { log, pinoExpress } = require("@spaship/common/lib/logging/pino");
const config = require("./config");
const routes = require("./routes/routes");
const Autosync = require("./lib/background/autosync");
const npmPackage = require("./package.json");

const app = express();
const autosync = new Autosync();

app.use(pinoExpress);

// BodyParser for parsing application/json and for parsing application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes.register(app);

app.listen(config.get("port"));

// do fun splash screen when in dev mode.  in production, be boring.
if (process.env.NODE_ENV === "production") {
  log.info(config.toObject(), `Starting SPAship ${npmPackage.version} with the following settings`);
} else {
  log.info(
    config.toObject(),
    `
███████╗██████╗  █████╗ ███████╗██╗  ██╗██╗██████╗  ██╗
██╔════╝██╔══██╗██╔══██╗██╔════╝██║  ██║██║██╔══██╗ ╚██╗
███████╗██████╔╝███████║███████╗███████║██║██████╔╝  ╚██╗
╚════██║██╔═══╝ ██╔══██║╚════██║██╔══██║██║██╔═══╝   ██╔╝
███████║██║     ██║  ██║███████║██║  ██║██║██║      ██╔╝
╚══════╝╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝      ╚═╝
Starting SPAship version ${npmPackage.version}.

Listening on http://${config.get("host")}:${config.get("port")}

Configuration:`
  );
}

if (config.get("autosync:enabled")) {
  autosync.start();
  if (config.get("autosync:onstartup")) {
    autosync.forceSyncAll();
  }
}

module.exports = { app, autosync, config, routes };
