const mongoose = require("mongoose");

const alias = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    propertyName: {
      type: String,
      required: false,
    },
    propertyTitle: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
    env: {
      type: String,
      required: false,
    },
    namespace: {
      type: String,
      required: false,
    },
    deploymentConnectionType: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    createdBy: {
      type: String,
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

alias.index({ propertyName: 1, env: 1 }, { unique: true });

module.exports = mongoose.model("alias", alias);
