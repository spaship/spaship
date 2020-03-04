const db_apikey = require("../../lib/db.apikey");

// Return a function for creating an API key for a given user.
module.exports = function createKeyMiddleware() {
  return async (req, res, next) => {
    const apikey = await db_apikey.attach();
    apikey.createKey(req.body.user).then(doc => {
      res.send(doc);
      next();
    });
  };
};
