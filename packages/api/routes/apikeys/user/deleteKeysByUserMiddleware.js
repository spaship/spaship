const db_apikey = require("../../../lib/db.apikey");

// Return a function for deleting all API keys for a given user.
module.exports = function deleteKeysByUser() {
  return async (req, res, next) => {
    const apikey = await db_apikey.attach();
    const user = req.query.user ? req.query.user.trim() : req.query.user;

    if (user) {
      const dbRes = await apikey.deleteKeysByUser(user);
      const doc = dbRes.error
        ? dbRes
        : {
            user: user,
            message: dbRes.deletedCount + " key(s) deleted."
          };

      res.send(doc);
    } else {
      res.send({
        error: "Invalid Parameter",
        message: "User ID Missing: User ID cannot be empty."
      });
    }
    next();
  };
};
