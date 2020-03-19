const uuidValidate = require("uuid-validate");
const apiKeyDB = require("../lib/db.apikey");

const apiKeyCheck = /^\s*APIKey/;
const apiKeyValue = /^\s*APIKey\s+(\S+)$/;

module.exports = function createApiKeyMiddleware() {
  return async function apiKeyMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    console.log("running api key middleware");

    req.apikey = req.apikey || {};

    let error;

    if (authHeader) {
      // validate the Auth header
      const apiKeys = await apiKeyDB.attach();

      if (apiKeyCheck.test(authHeader)) {
        const parsedHeader = apiKeyValue.exec(authHeader);

        if (parsedHeader) {
          const apiKey = parsedHeader[1];

          if (apiKey) {
            const validUuid = uuidValidate(apiKey, 4);
            if (!validUuid) {
              error = { name: "APIKeyMalformedError", message: "Malformed formed API key." };
            } else {
              // api key is valid; check for existence of the API key in the db
              const user = await apiKeys.getUserByKey(apiKey);
              const apiKeyExists = user.length > 0;
              if (!apiKeyExists) {
                error = { name: "APIKeyRejectedError", message: "API key rejected." };
              }
            }
          }
        }
      }
    }

    if (error) {
      req.apikey.error = error;
    }

    next();
    return;
  };
};
