const mongoose = require("mongoose");

const deploymentRecord = new mongoose.Schema(
  {
    propertyName: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    deploymentConnectionName: {
      type: String,
      required: true,
    },
    baseurl: {
      type: String,
      required: true,
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

module.exports = mongoose.model("deploymentRecord", deploymentRecord);
