const { cosmiconfigSync } = require("cosmiconfig");
const path = require("path");
const { defaultsDeep } = require("lodash");

// You can also search and load synchronously.
const explorerSync = cosmiconfigSync("spaship", {
  transform: (result) => {
    // search for a secondary spashiprc file, and merge the objects.  this allows a kind of "layering" of spashiprc
    // properties, which is especially useful when you want spashiprc `envs` to be tracked in version control but not
    // the `apikey` property.
    if (result) {
      const parentDir = path.dirname(path.dirname(result.filepath));
      const secondaryResult = explorerSync.search(parentDir);
      const merged = defaultsDeep({}, result, secondaryResult);
      return merged;
    }
  },
});

function loadRcFile() {
  // cosmiconfig has a built-in cache so we don't need to worry about reading the same file multiple times per CLI run.
  const loadedFile = explorerSync.search();

  return loadedFile ? loadedFile.config : {};
}

module.exports = { loadRcFile };
