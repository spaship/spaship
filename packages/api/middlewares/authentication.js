const jwt = require("express-jwt");
const { log } = require("@spaship/common/lib/logging/pino");
const APIKeyService = require("../services/apiKeyService");
const config = require("../config");
const keyUtil = require("../utils/keyUtil");
const jwtAuth = require("jsonwebtoken");
const APIKey = require("../models/apiKey");
const Unauthorized = require("../utils/errors/Unauthorized");

module.exports = () => {
  return async (req, res, next) => {
    const apiKey = APIKeyService.getAPIKeyFromRequest(req);

    // If an API key was provided, try to validate it.  Except on the /apiKeys endpoint.  API keys cannot be used to
    // create more API keys.
    if (apiKey && req.url.match(/^(?!\/v\d\/apiKeys)/)) {
      log.info("Use API Key validation");
      try {
        const validKey = await APIKeyService.validation(apiKey);
        if (validKey) {
          const propName = config.get("auth:keycloak:id_prop");
          req.user = {
            [propName]: validKey.get("userId"),
            authType: "apikey",
          };
          return next();
        }
      } catch (error) {
        return next(error);
      }
    }

    const extractToken = (req) => {
      const bearerHeader = req.headers["authorization"];
      try {
        if (typeof bearerHeader !== "undifined") {
          const bearer = bearerHeader.split(" ");
          const bearerToken = bearer[1];
          req.token = bearerToken;
          return bearerToken;
        }
      } catch (err) {
        next(new Unauthorized(`Authorization header missing.`));
      }
    };

    let token = extractToken(req);
    let shortApiKey = true;
    let error = false;
    let success = false;

    try {
      const result = await APIKey.findOne({ userId: token });
      if (result != null) {
        token = result.hashKey;
        shortApiKey = true;
      }
    } catch (e) {
      console.log(e);
    }

    jwtAuth.verify(token, config.get("token:secret"), function (err, data) {
      if (err) {
        if (err.message != "invalid algorithm") {
          res.status(400).json({ message: err.message });
          error = true;
        }
      } else {
        if (shortApiKey == true) {
          const propertyName = req.params?.propertyName;
          if (propertyName != data.propertyName) {
            error = true;
            res.status(400).json({ message: "Invalid APIkey for property" });
            return;
          }
        }
        success = true;
        return next();
      }
    });

    if (error == true || success == true) return;

    const secret = keyUtil.getPublicKey();
    return jwt({
      secret,
      algorithms: ["RS256"],
    })(req, res, next);
  };
};
