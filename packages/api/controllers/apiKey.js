const uuidv4 = require("uuid").v4;
const UnknownError = require("../utils/errors/UnknownError");
const { encrypt } = require("../utils/cryptoUtil");
const { getUserUUID } = require("../utils/requestUtil");
const APIKey = require("../models/apiKey");

module.exports.list = async (req, res) => {
  const userId = getUserUUID(req);
  try {
    const apiKeys = await APIKey.find({ userId }).select("label expiredDate");
    res.send(apiKeys);
  } catch (error) {
    throw new UnknownError(error);
  }
};

module.exports.post = async (req, res) => {
  const userId = getUserUUID(req);
  const { label, expiredDate } = req.body;
  const hashKey = encrypt(uuidv4());
  console.log(hashKey);
  const data = {
    label,
    hashKey,
    userId,
    expiredDate,
  };

  try {
    const apiKey = await APIKey.create(data);
    res.send(apiKey);
  } catch (error) {
    throw new UnknownError(error);
  }
};

module.exports.delete = async (req, res) => {
  const userId = getUserUUID(req);
  const label = req.body.label;
  try {
    const apiKey = await APIKey.findOne({ userId, label });

    if (apiKey) {
      await APIKey.deleteOne({ userId, label });
      res.send("");
    } else {
      res.status(404).send(`Can not find APIKey with label: ${label}`);
    }
  } catch (error) {
    throw new UnknownError(error);
  }
};
