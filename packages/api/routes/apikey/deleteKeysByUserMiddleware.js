const db_apikey = require("../../lib/db.apikey");

// Return a function for deleting all API keys for a given user.
module.exports = function deleteKeysByUser() {
  return async (req, res, next) => {
    const apikey = await db_apikey.attach();
    const user = req.body.user ? req.body.user.trim() : req.body.user;

    const doc = user
      ? await apikey.deleteKeysByUser(req.query.user)
      : {
          error: "Invalid Parameter",
          message: "Username Missing: Username cannot be empty."
        };

    res.send(doc);
    next();
  };
};
