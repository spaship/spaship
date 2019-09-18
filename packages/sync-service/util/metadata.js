const path = require("path");
const fs = require("fs");
const config = require("../config");
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);
const readdirAsync = promisify(fs.readdir);
const { zipObject } = require("lodash/fp");

function write({ appName, appPath, type, value } = {}) {
  const appMetaDir = path.resolve(
    config.any("metadata_dir", "webroot"),
    `.${appPath}`
  );
  const filePath = path.resolve(appMetaDir, type);
  fs.mkdir(appMetaDir, err => {
    if (err && err.code !== "EEXIST") {
      console.error(err);
    }
    fs.writeFile(filePath, value, err => {
      if (err) {
        console.error(err);
      } else {
        console.log(
          `[deploy] wrote ${appName}'s "${type}" metadata to ${filePath}`
        );
      }
    });
  });
}

async function readAll() {
  const dirs = await readdirAsync(config.get("metadata_dir"));
  const metaDirs = dirs.filter(n => n.startsWith("."));
  const allMeta = await Promise.all(metaDirs.map(readDir));
  return allMeta;
}

async function readDir(dir) {
  const metaFiles = ["ref", "name", "path"];
  const reads = metaFiles
    .map(n => path.resolve(config.get("metadata_dir"), dir, n))
    .map(n => readFileAsync(n));
  const result = await Promise.all(reads);

  const meta = zipObject(metaFiles, result.map(n => n.toString()));

  return meta;
}

module.exports = { write, readAll, readDir };
