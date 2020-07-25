// Read a spaship.yaml file and returns raw contents
const fsp = require("fs").promises;

async function readRaw(filepath) {
  return await fsp.readFile(filepath, { encoding: "utf-8" });
}

module.exports = readRaw;
