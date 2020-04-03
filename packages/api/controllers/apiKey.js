const uuidv4 = require("uuid").v4;
const { encrypt } = require("../utils/cryptoUtil");
const { getUserUUID } = require("../utils/requestUtil");
const NotFoundError = require("../utils/errors/NotFoundError");
const APIKey = require("../models/apiKey");

module.exports.list = async (req, res, next) => {
  const userId = getUserUUID(req);
  try {
    const results = await APIKey.find({ userId }).exec();
    const apiKeys = results.map((obj) => ({
      label: obj.label,
      shortKey: obj.shortKey,
      expiredDate: obj.expiredDate,
      createdAt: obj.createdAt,
    }));
    res.send(apiKeys);
  } catch (error) {
    next(error);
  }
};

module.exports.post = async (req, res, next) => {
  const userId = getUserUUID(req);
  const { label, expiredDate } = req.body;
  const key = uuidv4();
  const shortKey = key.substring(0, 7);
  const hashKey = encrypt(key);

  const data = {
    label,
    shortKey,
    hashKey,
    userId,
    expiredDate,
  };

  try {
    const result = await APIKey.create(data);
    res.status(201).send({
      label,
      key,
      expiredDate,
      createdAt: result.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.delete = async (req, res, next) => {
  const userId = getUserUUID(req);
  const { label } = req.params;
  try {
    const apiKey = await APIKey.findOneAndDelete({ label, userId });
    if (apiKey) {
      res.status(200).send("remove success");
    } else {
      throw new NotFoundError(`Can not found APIKey by label:${label}`);
    }
  } catch (error) {
    next(error);
  }
};
