#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const express = require("express");
const multer = require("multer");
const decompress = require("decompress");

const config = require("./config.js");

const upload = multer({
  dest: config.get("upload_dir"),
  fileFilter: (req, file, cb) => {
    console.log(file);
    // to reject file uploads: cb(null, false);
    cb(null, true);
  }
});

const app = express();

app.get("/", (req, res) => {
  fs.readFile(path.resolve(__dirname, "index.html"), (err, data) => {
    res.send(data.toString());
  });
});

app.post("/deploy", upload.single("upload"), (req, res, next) => {
  const { name } = req.body;
  const { path: filepath } = req.file;
  console.log(
    `DEPLOY received for "${name}", bundle saved to ${filepath}, extracting...`
  );

  const destDir = path.resolve(config.get("webroot"), name);

  decompress(filepath, destDir)
    .then(result => {
      console.log(`EXTRACTED "${name}" to ${destDir}.`);
      console.log(`DEPLOY completed for ${name}`);
    })
    .catch(err => {
      console.error(err);
    });

  res.send("Uploaded, deployment continuing in the background.");
  next();
});

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
