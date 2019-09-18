const path = require("path");
const fs = require("fs");
const { map } = require("lodash/fp");
const { promisify } = require("util");
const metadata = require("../util/metadata");

const config = require("../config");

const dirToListItem = file => ({ dir: file });
const filesToSpaList = map(dirToListItem);

// return an array of expressjs callbacks, the first using multer to support
// uploading multipart forms (ie, files), and the second to handle extraction
module.exports = function createListMiddleware() {
  return (req, res, next) => {
    // list dirs in webroot
    // omit chrome

    // const destDir = path.resolve(config.get("webroot"), name);
    metadata.readAll().then(meta => {
      res.send(meta);
      next();
    });
  };
};
