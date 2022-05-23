const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ApplicationSchema = new Schema(
  {
    propertyName: {
      type: String,
      required: true,
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", ApplicationSchema);
