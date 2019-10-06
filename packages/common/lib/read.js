// Read a spaship.yaml file
const fs = require("fs-extra");
const yaml = require("js-yaml");

async function read(filepath) {
  const rawYaml = await fs.readFile(filepath);
  return yaml.safeLoad(rawYaml, filepath);
}

module.exports = read;

if (require.main === module) {
  read(process.argv[2] || "spaship.yaml").then(result => console.log(result));
}
