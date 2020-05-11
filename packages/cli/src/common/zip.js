const path = require("path");
const fs = require("fs");
const os = require("os");
const archiver = require("archiver");

/**
 * Compress the directory contents of `directoryPath` and creates a zip archive in the os temp dir
 * @param {string} directoryPath - Directory to compress
 * @returns {Promise<string>} - Promise with the path of zip file created
 */
function zipDirectory(directoryPath) {
  const tempDir = os.tmpdir();
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  const zipPath = path.join(tempDir, "SPAShipArchive.zip");
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }
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
  const stream = fs.createWriteStream(out);

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
