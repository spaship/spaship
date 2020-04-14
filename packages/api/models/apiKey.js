const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const getExpiredDateMin = () => {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  return now;
};

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
    expiredDate: {
      type: Date,
      min: getExpiredDateMin(),
    },
    userId: String,
  },
  {
    timestamps: true,
  }
);

APIKeySchema.index({ label: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("APIKey", APIKeySchema);
