const db_apikey = require("../../../lib/db.apikey");

// Return a function for getting the user for a given API Key.
module.exports = function getUserByKey() {
  return async (req, res, next) => {
    const apikey = await db_apikey.attach();
    apikey.getUserByKey(req.query.hashedKey).then(user => {
      res.send(user);
      next();
    });
  };
};
