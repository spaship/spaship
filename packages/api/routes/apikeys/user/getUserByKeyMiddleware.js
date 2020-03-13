const db_apikey = require("../../../lib/db.apikey");
var validate = require("uuid-validate");

// Return a function for getting the user for a given API Key.
module.exports = function getUserByKey() {
  return async (req, res, next) => {
    const apikey = await db_apikey.attach();
    const hashedKey = req.query.hashedKey ? req.query.hashedKey.trim() : req.query.hashedKey;

    // Validate that the HashedKey confirms to uuid v4.
    const isValid = validate(hashedKey, 4);

    if (isValid) {
      const user = await apikey.getUserByKey(hashedKey);

      const doc = {
        user: user.length ? user[0].userid : ""
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
