const path = require("path");
const fsp = require("fs").promises;
const config = require("../config");
const common = require("@spaship/common");
const { flow, map, filter } = require("lodash/fp");

async function write(filename, extraData) {
  await common.config.append(filename, extraData);
}

// Get all the SPA directories in the webroot (not including hidden dirs), then
// look up metadata for each and return it.
async function getAll() {
  try {
    const webrootFiles = await fsp.readdir(config.get("webroot"), {
      withFileTypes: true
    });
    const spaDirs = flow(
      filter(d => d.isDirectory()),
      map("name"),
      map(get)
    )(webrootFiles);
    return await Promise.all(spaDirs);
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function get(spaDir) {
  // read the contents of the ref and name files
  try {
    // list entries with spaship.yaml
    return await common.config.read(
      path.resolve(config.get("webroot"), spaDir, "spaship.yaml")
    );
  } catch (e) {
    // list entries without spaship.yaml
    return { path: "/" + spaDir };
  }
}

module.exports = { write, getAll, get };
