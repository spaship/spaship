const db_apikey = require("../../lib/db.apikey");

function validateHashedKey(hashedKey) {
  const regex = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i;
  return regex.test(hashedKey);
}

// Return a function for deleting an API key passed as a parameter.
module.exports = function deleteKeyMiddleware() {
  return async (req, res, next) => {
    const apikey = await db_apikey.attach();
    const hashedKey = req.query.hashedKey ? req.query.hashedKey.trim() : req.query.hashedKey;
    const isValid = validateHashedKey(hashedKey);

    if (isValid) {
      const user = await apikey.getUserByKey(req.query.hashedKey);
      const dbRes = await apikey.deleteKey(req.query.hashedKey);

      const doc = dbRes.error
        ? dbRes
        : {
            user: user.length ? user[0].userid : "",
            message: dbRes.deletedCount + " key(s) deleted.",
            hashedKey: req.query.hashedKey
          };

      res.send(doc);
    } else {
      res.send({
        error: "Invalid Parameter",
        message: "Hashed Key Invalid: Argument is not a valid Hashed Key."
      });
    }
    next();
  };
};
