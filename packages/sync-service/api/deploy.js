const decompress = require("decompress");
const multer = require("multer");
const path = require("path");
const config = require("../config");

// return an array of expressjs callbacks, the first using multer to support
// uploading multipart forms (ie, files), and the second to handle extraction
function createDeployMiddleware() {
  const multerUpload = multer({
    dest: config.get("upload_dir"),
    fileFilter: (req, file, cb) => {
      console.log(file);
      // to reject file uploads: cb(null, false);
      cb(null, true);
    }
  });

  const upload = multerUpload.single("upload");

  const extract = (req, res, next) => {
    const { name } = req.body;
    const { path: filepath } = req.file;
    console.log(
      `DEPLOY received for "${name}", bundle saved to ${filepath}, extracting...`
    );

    const destDir = path.resolve(config.get("webroot"), name);

    decompress(filepath, destDir)
      .then(result => {
        console.log(`EXTRACTED "${name}" to ${destDir}.`);
        console.log(`DEPLOY completed for ${name}`);
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
