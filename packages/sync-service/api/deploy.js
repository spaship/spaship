const path = require("path");
const decompress = require("decompress");
const multer = require("multer");
const config = require("../config");
const { write: writeMetadata } = require("../util/metadata");

// return an array of expressjs callbacks, the first using multer to support
// uploading multipart forms (ie, files), and the second to handle extraction
function createDeployMiddleware() {
  const multerUpload = multer({
    dest: config.get("upload_dir"),
    fileFilter: (req, file, cb) => {
      // to reject file uploads: cb(null, false);
      cb(null, true);
    }
  });

  const upload = multerUpload.single("upload");

  const extract = (req, res, next) => {
    const { name, path: urlpath, ref } = req.body;
    const { path: filepath } = req.file;
    console.log(
      `[deploy] deploying "${name}", bundle saved to ${filepath}, extracting...`
    );

    // remove starting slashes in paths
    const destDirName = urlpath.replace(/^\//, "");
    const destDir = path.resolve(config.get("webroot"), destDirName);

    // extract the archive
    decompress(filepath, destDir)
      .then(result => {
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

        console.log(
          `[deploy] extracted "${name}" to ${destDir}, deploy complete.`
        );
      })
      .catch(err => {
        console.error(err);
      });

    res.send("Uploaded, deployment continuing in the background.");
    next();
  };

  return [upload, extract];
}

module.exports = createDeployMiddleware;
