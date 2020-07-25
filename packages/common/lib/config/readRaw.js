// Read a spaship.yaml file
const fsp = require("fs").promises;

async function readRaw(filepath) {
  return await fsp.readFile(filepath, { encoding: "utf-8" });
}

module.exports = readRaw;
