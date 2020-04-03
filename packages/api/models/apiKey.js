const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const APIKeySchema = new Schema(
  {
    label: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    shortKey: {
      type: String,
      required: true,
    },
    hashKey: {
      type: String,
      required: true,
      unique: true,
    },
    expiredDate: Date,
    userId: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("APIKey", APIKeySchema);
