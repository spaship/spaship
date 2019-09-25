const path = require("path");
const fsp = require("fs").promises;
const config = require("../config");
const { flow, map, filter } = require("lodash/fp");

/**
 * Get the path to the metadata directory of a given spa.
 */
function getMetaDir(spaDir) {
  return path.resolve(config.get("webroot"), spaDir, `.meta`);
}

async function write({ appPath, type, value } = {}) {
  const appMetaDir = getMetaDir(appPath);
  const filePath = path.resolve(appMetaDir, type);

  try {
    await fsp.mkdir(appMetaDir);
  } catch (e) {
    if (e.code !== "EEXIST") {
      console.error(e);
      return;
    }
  }

  try {
    await fsp.writeFile(filePath, value);
    console.log(
      `[deploy] wrote ${appName}'s "${type}" metadata to ${filePath}`
    );
  } catch (e) {
    console.error(e);
  }
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
  const [ref, name] = await Promise.all([
    readMetaFile(spaDir, "ref"),
    readMetaFile(spaDir, "name")
  ]);
  return {
    path: `/${spaDir}`,
    ref,
    name
  };
}

module.exports = { write, getAll, get };
