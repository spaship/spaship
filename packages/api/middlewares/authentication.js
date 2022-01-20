const jwt = require("express-jwt");
const { log } = require("@spaship/common/lib/logging/pino");
const APIKeyService = require("../services/apiKeyService");
const config = require("../config");
const keyUtil = require("../utils/keyUtil");
const jwtAuth = require("jsonwebtoken");
const Unauthorized = require("../utils/errors/Unauthorized");

module.exports = () => {
  return async (req, res, next) => {
    //return next();
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

    const token = extractToken(req);
    let error = false;
    let success = false;
    jwtAuth.verify(token, config.get("token:secret"), function (err, data) {
      if (err) {
        if (err.message != "invalid algorithm") {
          res.status(400).json({ message: err.message });
          error = true;
        }
      } else {
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
