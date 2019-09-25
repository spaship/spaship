const metadata = require("../../utils/metadata");

// Return a function for getting list of deployed spas and info about them
module.exports = function createListMiddleware() {
  return (req, res, next) => {
    metadata.getAll().then(meta => {
      res.send(meta);
      next();
    });
  };
};
