const path = require("path");
const decompress = require("decompress");
const config = require("../config");
const { write: writeMetadata } = require("./metadata");

async function deploy({ name, spaArchive, appPath, ref } = {}) {
  console.log(
    `[deploy] deploying "${name}", bundle saved to ${spaArchive}, extracting...`
  );

  // remove starting slashes in paths
  const appPathNoSlash = appPath.replace(/^\//, "");
  const destDir = path.resolve(config.get("webroot"), appPathNoSlash);

  // extract the archive
  try {
    await decompress(spaArchive, destDir);

    // write spa metadata to filesystem
    writeMetadata({
      appName: name,
      appPath: destDir,
      type: "ref",
      value: ref
    });
    writeMetadata({
      appName: name,
      appPath: destDir,
      type: "name",
      value: name
    });

    console.log(`[deploy] extracted "${name}" to ${destDir}, deploy complete.`);
  } catch (err) {
    console.error(err);
  }
}

module.exports = deploy;
