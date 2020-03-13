const db_apikey = require("../../lib/db.apikey");

// Return a function for deleting an API key passed as a parameter.
module.exports = function deleteKeyMiddleware() {
  return async (req, res, next) => {
    const apikey = await db_apikey.attach();
    const hashedKey = req.query.hashedKey ? req.query.hashedKey.trim() : req.query.hashedKey;
    if (hashedKey) {
      const user = await apikey.getUserByKey(req.query.hashedKey);
      const db_res = await apikey.deleteKey(req.query.hashedKey);
      const doc = {
        user: user[0].userid,
        message: db_res.deletedCount + " key(s) deleted.",
        hashedKey: req.query.hashedKey
      };
      res.send(doc);
    } else {
      res.send({
        error: "Invalid Parameter",
        message: "HashedKey Missing: HashedKey cannot be empty."
      });
    }
    next();
  };
};
