const db_apikey = require("../../lib/db.apikey");

// Return a function for creating an API key for a given user.
module.exports = function getKeysByUser() {
  return async (req, res, next) => {
    const apikey = await db_apikey.attach();
    apikey.getKeysByUser(req.query.user).then(keys => {
      res.send(keys);
      next();
    });
  };
};
