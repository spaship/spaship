// Read a spaship.yaml file
const fs = require("fs");
const fsp = fs.promises;
const yaml = require("js-yaml");

async function findAsync(arr, asyncPredicate) {
  for (const val of arr) {
    const found = await asyncPredicate(val);
    if (found) {
      return val;
    }
  }
}

async function read(_filepath, options = { checkExtensionVariations: true }) {
  let filepath = _filepath;
  if (options.checkExtensionVariations) {
    const dotSplit = _filepath.split(".");
    const ext = dotSplit.length >= 2 ? dotSplit.pop() : "";
    const filePrefix = dotSplit.join(".");
    const readableFileName = await findAsync(
      [ext, "yml", "yaml", "YML", "YAML"].map((x) => `${filePrefix}.${x}`),
      isReadable
    );
    filepath = readableFileName || filepath;
  }
  const rawYaml = await fsp.readFile(filepath);
  return yaml.load(rawYaml, filepath);
}

async function isReadable(filepath) {
  // Check if the file is readable.
  try {
    const access = await fsp.access(filepath, fs.constants.R_OK);
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = read;
