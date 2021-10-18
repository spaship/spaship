const mongoose = require("mongoose");

const eventTimeTrace = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  traceId: {
    type: String,
    required: true,
  },
  propertyName: {
    type: String,
    required: false,
  },
  spaName: {
    type: String,
    required: false,
  },
  envs: {
    type: String,
    required: false,
  },
  initialCode: {
    type: String,
    required: false,
  },
  finalCode: {
    type: String,
    required: false,
  },
  failure: {
    type: Boolean,
    required: false,
  },
  createdAt: {
    type: Date,
    required: false,
  },
  completedAt: {
    type: Date,
    required: false,
  },
  consumedTime: {
    type: Number,
    required: false,
  },
});

module.exports = mongoose.model("eventTimeTrace", eventTimeTrace);
