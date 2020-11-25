const jwt = require("express-jwt");
const { log } = require("@spaship/common/lib/logging/pino");
const APIKeyService = require("../services/apiKeyService");
const config = require("../config");
const keyUtil = require("../utils/keyUtil");

module.exports = () => {
  const secret = keyUtil.getPublicKey();

  return async (req, res, next) => {
    const apiKey = APIKeyService.getAPIKeyFromRequest(req);

    // Use API key check, it should not use apiKey to do validation
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

    log.info("Use JWT validation");
    return jwt({
      secret,
      algorithms: ["RS256"],
    })(req, res, next);
  };
};
