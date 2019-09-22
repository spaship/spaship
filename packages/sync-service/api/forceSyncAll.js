const Autosync = require("../background/autosync");

// Return a function for getting list of deployed spas and info about them
module.exports = function createAutosyncMiddleware() {
  const autosync = new Autosync();

  return (req, res, next) => {
    autosync.forceSyncAll();
    res.send("Forcing all autosync targets to sync now");
    next();
  };
};
