const db_apikey = require("../../../lib/db.apikey");
var validator = require("validator");

// Return a function for deleting an API key passed as a parameter.
module.exports = function deleteKeyMiddleware() {
  return async (req, res, next) => {
    const apikey = await db_apikey.attach();
    const hashedKey = req.query.hashedKey ? req.query.hashedKey.trim() : req.query.hashedKey;

    // Validate that the HashedKey is a hex hash which confirms to sha256.
    const isValid = validator.isHash(hashedKey, "sha256");

    if (isValid) {
      const user = await apikey.getUserByHashedKey(hashedKey);
      const dbRes = await apikey.deleteKey(hashedKey);

      const doc = dbRes.error
        ? dbRes
        : {
            user: user.length ? user[0].userid : "",
            message: dbRes.deletedCount + " key(s) deleted.",
            hashedKey: hashedKey,
          };

      res.send(doc);
    } else {
      res.send({
        error: "Invalid Parameter",
        message: "Hashed Key Invalid: Argument is not a valid Hashed Key.",
      });
    }
    next();
  };
};
