const mongoose = require("mongoose");
const eventTimeTrace = require("../../models/eventTimeTrace");
const webProperty = require("../../models/webProperty");
const event = require("../../models/event");

const clearData = async (req, res) => {
  res.status(200).json(await clearDataService(req.sanitize(req.body.collectionName)));
};

const clearDataService = async (collectionName) => {
  try {
    await mongoose.connection.collection(collectionName).drop();
    return { Message: `Collection ${collectionName} dropped successfully` };
  } catch (e) {
    console.log(e);
  }
};

module.exports = { clearData, clearDataService };
