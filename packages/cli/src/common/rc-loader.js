const { cosmiconfigSync } = require("cosmiconfig");

// You can also search and load synchronously.
const explorerSync = cosmiconfigSync("spaship");

let config;

function loadRcFile() {
  // return cached config if possible
  if (config) {
    return config;
  }

  const loadedFile = explorerSync.search();

  if (loadedFile) {
    config = loadedFile.config;
  } else {
    config = {};
  }

  return config;
}

module.exports = { loadRcFile };
