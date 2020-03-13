const db_apikey = require("../../lib/db.apikey");

// Return a function for creating an API key for a given user.
module.exports = function createKeyMiddleware() {
  return async (req, res, next) => {
    const apikey = await db_apikey.attach();
    const user = req.body.user ? req.body.user.trim() : req.body.user;
    const doc = user
      ? await apikey.createKey(req.body.user)
      : {
          error: "Invalid Parameter",
          message: "Username Missing: Username cannot be empty. It is needed to create and assign a new API Key."
        };
    res.send(doc);
    next();
  };
};
