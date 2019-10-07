const path = require("path");
const fsp = require("fs").promises;
const config = require("../config");
const common = require("@spaship/common");
const { flow, map, filter } = require("lodash/fp");

/**
 * Get the path to the metadata directory of a given spa.
 */
function getMetaDir(spaDir) {
  return path.resolve(config.get("webroot"), spaDir, `.meta`);
}

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

// Read a metadata file and return the file's contents, or null if the file
// can't be read for any reason.
async function readMetaFile(spaDir, filename) {
  try {
    const value = await fsp.readFile(
      path.resolve(getMetaDir(spaDir), filename)
    );
    return value.toString().trim();
  } catch (e) {
    // don't log "does not exist" errors, they are expected
    if (e.code !== "ENOENT") {
      console.log(e);
    }
    return null;
  }
}

async function get(spaDir) {
  // read the contents of the ref and name files
  return await common.config.read(path.join(spaDir, "spaship.yaml"));
}

module.exports = { write, getAll, get };
