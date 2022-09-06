const mongoose = require("mongoose");

const props = new mongoose.Schema({
  env: {
    type: String,
    required: false,
  },
  spaName: {
    type: String,
    required: false,
  },
});

const activityStream = new mongoose.Schema(
  {
    source: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    propertyName: {
      type: String,
      required: true,
    },
    props: props,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("activityStream", activityStream);
