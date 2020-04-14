const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const APIKeySchema = new Schema(
  {
    label: {
      type: String,
      required: true,
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

APIKeySchema.index({ label: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("APIKey", APIKeySchema);
