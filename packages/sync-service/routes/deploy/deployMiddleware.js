const path = require("path");
const fsp = require("fs").promises;
const decompress = require("decompress");
const multer = require("multer");
const config = require("../../config");
const { write: writeMetadata } = require("../../lib/metadata");
const deploy = require("../../lib/deploy");

const multerUpload = multer({
  dest: config.get("upload_dir"),
  fileFilter: (req, file, cb) => {
    // to reject file uploads: cb(null, false);
    cb(null, true);
  }
});

// return an array of expressjs callbacks, the first using multer to support
// uploading multipart forms (ie, files), and the second to handle extraction
function createDeployMiddleware() {
  const upload = multerUpload.single("upload");

  const extract = (req, res, next) => {
    const { name, path: appPath, ref } = req.body;
    const { path: spaArchive } = req.file;

    deploy({ name, spaArchive, appPath, ref })
      .then((result, err) => {
        res.send("SPA deployed successfully.");
      })
      .catch(err => {
        res.status(403);
        res.send("Deploy failed.  " + err);
        console.log(err);
      });
  };

  return [upload, extract];
}

module.exports = createDeployMiddleware;
