const db_apikey = require("../../lib/db.apikey");

// Return a function for deleting an API key passed as a parameter.
module.exports = function deleteKeyMiddleware() {
  return async (req, res, next) => {
    const apikey = await db_apikey.attach();
    const user = await apikey.getUserByKey(req.query.hashedKey);
    const doc = await apikey.deleteKey(req.query.hashedKey);
    res.send({
      user: user[0].userid,
      message: doc.deletedCount + " key(s) deleted.",
      hashedKey: req.query.hashedKey
    });
    next();
  };
};
