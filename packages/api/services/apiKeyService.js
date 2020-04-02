const APIKey = require("../models/apiKey");
const APIKeyError = require("../utils/errors/APIKeyError");
const { encrypt } = require("../utils/cryptoUtil");

const getAPIKeysByUser = (userId) => APIKey.find({ userId });

const validation = async (apiKey) => {
  const hashKey = encrypt(apiKey);
  const result = await APIKey.findOne({ hashKey });

  if (result) {
    const expiredDate = result.get("expiredDate");
    if (expiredDate && expiredDate.getTime() <= new Date().getTime()) {
      throw new APIKeyError("API Key is expired");
    }
    return result;
  }
  throw new APIKeyError("API Key is invalid");
};

// https://learning.postman.com/docs/postman/sending-api-requests/authorization/#api-key
const getAPIKeyFromRequest = (req) => {
  const header = req.headers["x-api-key"];
  const query = req.query["api_key"];
  return header || query;
};

module.exports = {
  getAPIKeyFromRequest,
  validation,
  getAPIKeysByUser,
};
