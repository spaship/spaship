const fsp = require("fs").promises;
const path = require("path");

const { log } = require("@spaship/common/lib/logging/pino");
const config = require("./config");


let pathMappingsData = {
  pathMappings: [],
};

async function loadPathMappings() {
  const filePath = path.join(config.get("webroot"), '.routemapping');
  try {
    try {
      await fsp.access(filePath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        await fsp.writeFile(filePath, JSON.stringify([]), 'utf8');
      } else {
        throw err;
      }
    }
    const data = await fsp.readFile(filePath, 'utf8');
    pathMappingsData.pathMappings = JSON.parse(data);
  } catch (err) {
    log.error({"route_mapping_error": err}, "Error reading path mappings file .routemapping");
  }
  log.info({"message": "invoked"}, "Loaded path mappings");
}
module.exports = { pathMappingsData, loadPathMappings };