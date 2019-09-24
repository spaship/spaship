const path = require("path");
const fs = require("fs");
const config = require.main.require("./config");
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);
const readdirAsync = promisify(fs.readdir);
const mkdirAsync = promisify(fs.mkdir);
const writeFileAsync = promisify(fs.writeFile);

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
    await mkdirAsync(appMetaDir);
  } catch (e) {
    if (e.code !== "EEXIST") {
      console.error(e);
      return;
    }
  }

  try {
    await writeFileAsync(filePath, value);
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
    const spaDirs = await readdirAsync(config.get("webroot"));
    return await Promise.all(spaDirs.map(get));
  } catch (e) {
    return [];
  }
}

// Read a metadata file and return the file's contents, or null if the file
// can't be read for any reason.
async function readMetaFile(spaDir, filename) {
  try {
    const value = await readFileAsync(
      path.resolve(getMetaDir(spaDir), filename)
    );
    console.log(value);
    return value.toString().trim();
  } catch (e) {
    console.log(e);
    return null;
  }
}

async function get(spaDir) {
  return {
    path: `/${spaDir}`,
    ref: await readMetaFile(spaDir, "ref"),
    name: await readMetaFile(spaDir, "name")
  };
}

module.exports = { write, getAll, get };
