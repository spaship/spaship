const path = require("path");
const fsp = require("fs").promises;
const config = require("../config");
const common = require("@spaship/common");
const { flow, map } = require("lodash/fp");

const write = async (filename, extraData) => await common.config.append(filename, extraData);

/**
 * Get all the SPA directories in the webroot (not including hidden dirs), then
 * look up metadata for each and return it.
 */
const getAll = async () => {
  try {
    const webrootFiles = await fsp.readdir(config.get("webroot"));
    const validFiles = webrootFiles.filter((fileName) => /^(?![_\.])[a-zA-Z0-9\_\-]*$/.test(fileName));
    const spaDirs = flow(map(get))(validFiles);
    return await Promise.all(spaDirs);
  } catch (e) {
    console.error(e);
  }
  return [];
};

const get = async (spaDir) => {
  // read the contents of the ref and name files
  try {
    // list entries with spaship.yaml
    const yamlContent = await common.config.read(path.resolve(config.get("webroot"), spaDir, "spaship.yaml"));
    const stat = await fsp.stat(path.resolve(config.get("webroot"), spaDir));
    return {
      ...yamlContent,
      timestamp: stat.ctime,
    };
  } catch (error) {
    console.error(error);
    // list entries without spaship.yaml
    return { path: "/" + spaDir };
  }
};

const remove = async (spaPath) => {
  try {
    const flatPath = common.flatpath.toDir(spaPath);
    const destDir = path.join(config.get("webroot"), flatPath);
    await fsp.rmdir(destDir, { recursive: true });
  } catch (error) {
    console.error(error);
  }
};

const find = async (name) => {
  try {
    const all = await getAll();
    const match = all.find((spa) => spa.name === name);
    return match;
  } catch (error) {
    console.error(error);
  }
  return null;
};

module.exports = { write, getAll, get, remove, find };
