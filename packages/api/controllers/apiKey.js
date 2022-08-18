const uuidv4 = require("uuid").v4;
const { hash } = require("../utils/cryptoUtil");
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
      createdBy : obj.userId,
      createdAt: obj.createdAt,
    }));
    if (apiKeys.length == 0) res.status(404).send({ message: `No apikeys avaliable for ${userId}` });
    res.send(apiKeys);
  } catch (error) {
    next(error);
  }
};

module.exports.propertyList = async (req, res, next) => {
  const propertyName = req.params.propertyName;
  try {
    const results = await APIKey.find({ propertyName: propertyName }).exec();
    const apiKeys = results.map((obj) => ({
      label: obj.label,
      propertyName: obj.propertyName,
      shortKey: obj.shortKey,
      expirationDate: obj.expiredDate,
      createdBy: obj.userId,
      createdAt: obj.createdAt,
    }));
    if (apiKeys.length == 0) return res.status(404).send({ message: `No apikeys avaliable for ${propertyName}` });
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
  const hashKey = hash(key);

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
      shortKey,
      key,
      expiredDate,
      createdAt: result.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.delete = async (req, res, next) => {
  const { propertyName, shortKey } = req.params;
  try {
    const apiKey = await APIKey.findOneAndDelete({ propertyName, shortKey });
    if (apiKey) {
      res.status(200).json({ message: "API key removed successfully." });
    } else {
      next(new NotFoundError(`API key for ${propertyName} not found.`));
    }
  } catch (error) {
    next(error);
  }
};
