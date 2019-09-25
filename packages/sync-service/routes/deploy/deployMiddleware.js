const path = require("path");
const decompress = require("decompress");
const multer = require("multer");
const config = require("../../config");
const { write: writeMetadata } = require("../../lib/metadata");
const deploy = require("../../lib/deploy");

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

  const extract = (req, res) => {
    const { name, path: appPath, ref } = req.body;
    const { path: spaArchive } = req.file;

    deploy({ name, spaArchive, appPath, ref });

    res.send("SPA uploaded, deployment continuing in the background.");
  };

  return [upload, extract];
}

module.exports = createDeployMiddleware;
