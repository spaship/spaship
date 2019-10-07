// Write a spaship.yaml file
//
// TODO copy code over from @spaship/cli

const fsp = require("fs").promises;
const yaml = require("js-yaml");

async function write(filename, data) {
  await fsp.writeFile(filename, yaml.safeDump(data));
  return true;
}

module.exports = write;
