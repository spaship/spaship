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
    log.info(req.headers);
    log.info(req.body);
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
      } catch (err) {
        log.error(err);
        return next(err);
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
        log.error(err);
        next(new Unauthorized(`Authorization header missing.`));
      }
    };

    let token = extractToken(req);
    let shortApiKey = false;
    let error = false;
    let success = false;

    try {
      const result = await APIKey.findOne({ key: token });
      if (result != null) {
        token = result.token;
        shortApiKey = true;
      }
    } catch (err) {
      log.error(err);
    }

    jwtAuth.verify(token, config.get("token:secret"), function (err, data) {
      if (err) {
        if (err.message != "invalid algorithm") {
          log.error("Invalid algoritgm for the given token (APIkey mismatch for the env)");
          res.status(401).json({ message: err.message });
          error = true;
        }
      } else {
        if (shortApiKey == true) {
          const props = req.originalUrl.split("/");
          if (props[props.length - 2] != data.propertyName || !checkEnv(props, data)) {
            error = true;
            log.error("Access denied (Mismatch in PropertyName or Env)");
            res.status(401).json({ message: "Access denied" });
            return;
          }
        }
        success = true;
        log.info("Authentication successful for the API Key");
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
function checkEnv(props, data) {
  try {
    const env = props[props.length - 1];
    const envList = data.env;
    return envList.includes(env);
  } catch (err) {
    log.err(err);
    return next();
  }
}
