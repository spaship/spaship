#!/usr/bin/env node

const fs = require("fs");
const express = require("express");
const path = require("path");

const config = require("./config");
const deploy = require("./api/deploy");
const list = require("./api/list");

const app = express();

app.get("/", (req, res) => {
  fs.readFile(path.resolve(__dirname, "index.html"), (err, data) => {
    res.send(data.toString());
  });
});

app.post("/deploy", ...deploy());
app.get("/list", list());

app.listen(config.get("port"));

console.log(` ____  ____   __   __ _  ____  _  _
/ ___)(  _ \\ / _\\ (  ( \\(    \\( \\/ )
\\___ \\ ) __//    \\/    / ) D ( )  (
(____/(__)  \\_/\\_/\\_)__)(____/(_/\\_)
`);
console.log(`Running with configuration:\n`);
console.log(config.toString());
console.log();
console.log(`Listening on http://${config.get("host")}:${config.get("port")}`);
