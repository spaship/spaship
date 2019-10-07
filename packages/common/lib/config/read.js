// Read a spaship.yaml file
const fsp = require("fs").promises;
const yaml = require("js-yaml");

async function read(filepath) {
  const rawYaml = await fsp.readFile(filepath);
  return yaml.safeLoad(rawYaml, filepath);
}

module.exports = read;

if (require.main === module) {
  read(process.argv[2] || "spaship.yaml").then(result => console.log(result));
}
