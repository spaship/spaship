const APIKey = require("../models/apiKey");
const APIKeyError = require("../utils/errors/APIKeyError");
const { hash } = require("../utils/cryptoUtil");

const getAPIKeysByUser = (userId) => APIKey.find({ userId });

const apiKeyTokenRegex = /^apikey\s/i;

const validation = async (apiKey) => {
  const hashKey = hash(apiKey);
  const result = await APIKey.findOne({ hashKey });

  if (result) {
    const expiredDate = result.get("expiredDate");
    if (expiredDate && expiredDate.getTime() <= new Date().getTime()) {
      throw new APIKeyError("API Key is expired");
    }
    return result;
  }
  throw new APIKeyError("API key is invalid.");
};

// https://learning.postman.com/docs/postman/sending-api-requests/authorization/#api-key
const getAPIKeyFromRequest = (req) => {
  const header = req.headers["authorization"];
  let headerKey;

  // retrieve api key from header and from querystring
  if (header && apiKeyTokenRegex.test(header)) {
    headerKey = header.replace(apiKeyTokenRegex, "").trim();
  }
  const queryKey = req.query["api_key"] && req.query["api_key"].trim();

  return headerKey || queryKey;
};

module.exports = {
  getAPIKeyFromRequest,
  validation,
  getAPIKeysByUser,
};
