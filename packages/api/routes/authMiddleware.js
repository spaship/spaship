// Return a function for getting list of deployed spas and info about them

const uuidValidate = require("uuid-validate");
const apiKeyDB = require("../lib/db.apikey");
const config = require("../config");

const apiKeyCheck = /^\s*APIKey/;
const apiKeyValue = /^\s*APIKey\s+(\S+)$/;

module.exports = function createAuthMiddleware() {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      const msg = "Authorization header not provided.";
      res.status(401).send({ msg });
      next(new Error(msg));
      return;
    } else {
      // validate the Auth header

      const apiKeys = await apiKeyDB.attach();

      if (apiKeyCheck.test(authHeader)) {
        console.log("api key provided");

        const parsedHeader = apiKeyValue.exec(authHeader);

        if (parsedHeader == null) {
          const msg = "Improperly formed API Key in Authorization header.";
          res.status(403).send({ msg });
          next(new Error(msg));
          return;
        }

        const apiKey = parsedHeader[1];

        if (apiKey) {
          const validUuid = uuidValidate(apiKey, 4);
          if (!validUuid) {
            const msg = "Improperly formed API Key.";
            res.status(403).send({ msg });
            next(new Error(msg));
            return;
          } else {
            // api key is valid; check for existence of the API key in the db
            const apiKeyExists = await apiKeys.getUserByKey(apiKey);
            if (apiKeyExists.length) {
              console.log(`user has api key +1`, apiKeyExists);
              next();
            } else {
              const msg = "API Key rejected.";
              res.status(403).send({ msg });
              next(new Error(msg));
              return;
            }
          }
        }
      }
    }

    // metadata.getAll().then(meta => {
    //   res.send(meta);
    //   next();
    // });
  };
};
