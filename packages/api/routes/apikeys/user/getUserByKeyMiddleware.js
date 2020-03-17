const db_apikey = require("../../../lib/db.apikey");
var validate = require("uuid-validate");

// Return a function for getting the user for a given API Key.
module.exports = function getUserByKey() {
  return async (req, res, next) => {
    const apikey = await db_apikey.attach();
    const apiKey = req.query.apiKey ? req.query.apiKey.trim() : req.query.apiKey;

    // Validate that the API Key confirms to uuid v4.
    const isValid = validate(apiKey, 4);

    if (isValid) {
      const user = await apikey.getUserByKey(apiKey);

      const doc = {
        user: user.length ? user[0].userid : ""
      };

      res.send(doc);
    } else {
      res.send({
        error: "Invalid Parameter",
        message: "API Key Invalid: Argument is not a valid API Key."
      });
    }
    next();
  };
};
