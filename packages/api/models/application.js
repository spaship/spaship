const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ApplicationSchema = new Schema(
  {
    propertyName: {
      type: String,
      required: true,
    },
    identifier: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      index: true,
    },
    path: {
      type: String,
      required: true,
      index: true,
    },
    userId: String,
    env: {
      type: String,
      required: false,
    },
    ref: {
      type: String,
      required: false,
    },
    nextRef: {
      type: String,
      required: false,
    },
    namespace: {
      type: String,
      required: false,
    },
    accessUrl: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", ApplicationSchema);
