const db_apikey = require("../../lib/db.apikey");

// Return a function for deleting an API key passed as a parameter.
module.exports = function deleteKeyMiddleware() {
  return async (req, res, next) => {
    const apikey = await db_apikey.attach();
    apikey.deleteKey(req.params.hashedKey).then(() => {
      res.send("Key deleted");
      next();
    });
  };
};
