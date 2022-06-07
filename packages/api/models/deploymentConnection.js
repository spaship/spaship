const mongoose = require("mongoose");

const deploymentConnection = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    alias: {
      type: String,
      required: true,
    },
    baseurl: {
      type: String,
      required: true,
    },
    type: {
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

module.exports = mongoose.model("deploymentConnection", deploymentConnection);
