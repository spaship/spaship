const jwt = require("express-jwt");
const { log } = require("@spaship/common/lib/logging/pino");
const APIKeyService = require("../services/apiKeyService");
const config = require("../config");
const keyUtil = require("../utils/keyUtil");

module.exports = () => {
  const secret = keyUtil.getPublicKey();

  return async (req, res, next) => {
    const apiKey = APIKeyService.getAPIKeyFromRequest(req);

    // Use API key check
    if (apiKey) {
      log.info("Use API Key validation");
      try {
        const validKey = await APIKeyService.validation(apiKey);
        if (validKey) {
          const propName = config.get("auth:keycloak:id_prop");
          req.user = {
            [propName]: validKey.get("userId"),
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
    })(req, res, next);
  };
};
