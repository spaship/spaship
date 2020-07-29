const path = require("path");
const fs = require("fs");
const os = require("os");
const archiver = require("archiver");
const readPkgUp = require("read-pkg-up");

/**
 * Compress the directory contents of `directoryPath` and creates a zip archive in the os temp dir
 * @param {string} directoryPath - Directory to compress
 * @param {string} rawSpashipYml - Contents of the spaship.yml file
 * @returns {Promise<string>} - Promise with the path of zip file created
 */
function zipDirectory(directoryPath, rawSpashipYml) {
  const tempDir = os.tmpdir();
  try {
    fs.mkdirSync(tempDir); // If temp dir doesn't exist create it
  } catch (e) {
    // Do nothing
  }
  try {
    fs.writeFileSync(path.join(directoryPath, "spaship.yaml"), rawSpashipYml); // Write spaship.yaml if not found
  } catch (e) {
    // Do nothing
  }
  const pkgData = readPkgUp.sync();
  const pkgName =
    pkgData && pkgData.packageJson && pkgData.packageJson["name"] ? pkgData.packageJson["name"] : "SPAShipArchive";
  const pkgVersion =
    pkgData && pkgData.packageJson && pkgData.packageJson["version"] ? pkgData.packageJson["version"] : "";
  const zipPath = path.join(tempDir, `${pkgName}${pkgVersion ? "-" + pkgVersion : ""}.zip`);
  return zipUtil(directoryPath, zipPath);
}

/**
 * Promisified implementation of Archiver
 * @param {string} source - directory to zip
 * @param {string} out - output zip file path
 * @returns {Promise<string>}
 */
function zipUtil(source, out) {
  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = fs.createWriteStream(out, { flags: "w" }); // Open in truncate mode

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false, {})
      .on("error", (err) => reject(err))
      .pipe(stream);
    stream.on("close", () => resolve(out));
    archive.finalize();
  });
}

module.exports = { zipDirectory };
