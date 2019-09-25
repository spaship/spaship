#!/usr/bin/env node

const express = require("express");

const config = require("./config");
const routes = require("./routes/routes");
const Autosync = require("./background/autosync");
const package = require("./package.json");

const app = express();
const autosync = new Autosync();

routes.register(app);

app.listen(config.get("port"));

console.log(`
███████╗██████╗  █████╗ ███████╗██╗  ██╗██╗██████╗  ██╗
██╔════╝██╔══██╗██╔══██╗██╔════╝██║  ██║██║██╔══██╗ ╚██╗
███████╗██████╔╝███████║███████╗███████║██║██████╔╝  ╚██╗
╚════██║██╔═══╝ ██╔══██║╚════██║██╔══██║██║██╔═══╝   ██╔╝
███████║██║     ██║  ██║███████║██║  ██║██║██║      ██╔╝
╚══════╝╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝      ╚═╝ `);
console.log(
  `Starting SPAship version ${package.version} with configuration:\n`
);
console.log(config.toString());
console.log();
console.log(`Listening on http://${config.get("host")}:${config.get("port")}`);

autosync.start();
