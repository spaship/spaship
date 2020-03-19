const Autosync = require("../../lib/background/autosync");

module.exports = function createAutosyncMiddleware() {
  const autosync = new Autosync();

  return (req, res, next) => {
    autosync.forceSyncAll();
    res.send("Forcing all autosync targets to sync now");
    next();
  };
};
