const path = require("path");
const fs = require("fs");
const config = require("../config");
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);
const readdirAsync = promisify(fs.readdir);
const mkdirAsync = promisify(fs.mkdir);
const writeFileAsync = promisify(fs.writeFile);

async function write({ appName, appPath, type, value } = {}) {
  const appMetaDir = path.resolve(config.get("webroot"), `.${appPath}`);
  const filePath = path.resolve(appMetaDir, type);

  // create the webroot (if it doesn't exist
  try {
    await mkdirAsync(config.get("webroot"));
  } catch (e) {
    if (e.code !== "EEXIST") {
      console.error(e);
      return;
    }
  }

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
    const dirs = await readdirAsync(config.get("webroot"));
    const spaDirs = dirs.filter(n => !n.startsWith("."));
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
      path.resolve(config.get("webroot"), `.${spaDir}`, filename)
    );
    return value.toString().trim();
  } catch (e) {
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
