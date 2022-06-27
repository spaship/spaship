const mongoose = require("mongoose");

const event = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    eventId: {
      type: String,
      required: true,
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
    version: {
      type: String,
      required: false,
    },
    env: {
      type: String,
      required: false,
    },
    branch: {
      type: String,
      required: false,
    },
    code: {
      type: String,
      required: false,
    },
    accessUrl: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    path: {
      type: String,
      required: false,
    },
    failure: {
      type: Boolean,
      required: false,
    },
    isActive: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("event", event);
