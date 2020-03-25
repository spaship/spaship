const db_apikey = require("../../../lib/db.apikey");

// Return a function for getting all API keys for a given user.
module.exports = function getKeysByUser() {
  return async (req, res, next) => {
    const apikey = await db_apikey.attach();
    const user = req.query.user ? req.query.user.trim() : req.query.user;
    const doc = user
      ? await apikey.getKeysByUser(user)
      : {
          error: "Invalid Parameter",
          message: "User ID Missing: User ID cannot be empty. It is needed to identify and fetch API Keys."
        };
    res.send(doc);
    next();
  };
};
