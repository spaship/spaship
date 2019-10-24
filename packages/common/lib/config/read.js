// Read a spaship.yaml file
const fsp = require("fs").promises;
const yaml = require("js-yaml");

async function read(filepath) {
  console.log(fsp);
  const rawYaml = await fsp.readFile(filepath);
  return yaml.safeLoad(rawYaml, filepath);
}

module.exports = read;
