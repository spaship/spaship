const mongoose = require("mongoose");

const alias = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  property: {
    type: String,
    required: false,
  },
  name: {
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
  type: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    required: false,
  },
 
});

module.exports = mongoose.model("alias", alias);
