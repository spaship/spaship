
const mongoose = require('mongoose');
const eventTimeTrace = require('../../models/eventTimeTrace');
const website = require('../../models/website');
const event = require('../../models/event');

module.exports = async function clearData(req, res) {
  try {
    await mongoose.connection.collection(req.body.collection).drop();
    res.status(200).json({ "Message": `Collection ${req.body.collection} dropped successfully` })
  } catch (e) {
    console.log(e);
    res.status(200).json({ "Error": e })
  };
}