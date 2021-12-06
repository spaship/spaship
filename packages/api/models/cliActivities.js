const mongoose = require("mongoose");

const cliActivities = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: false,
  },
  webProperty: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  isActive: {
    type: Boolean,
    required: false,
  },
  createdAt: {
    type: Date,
    required: false,
  },
  udpatedAt: {
    type: Date,
    required: false,
  },
});

module.exports = mongoose.model("cliActivities", cliActivities);