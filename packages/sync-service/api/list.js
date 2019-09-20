const metadata = require("../util/metadata");

// return an array of expressjs callbacks, the first using multer to support
// uploading multipart forms (ie, files), and the second to handle extraction
module.exports = function createListMiddleware() {
  return (req, res, next) => {
    metadata.getAll().then(meta => {
      res.send(meta);
      next();
    });
  };
};
