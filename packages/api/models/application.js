const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ApplicationSchema = new Schema(
  {
    name: {
      type: String,
      index: true,
      unique: true,
    },
    path: {
      type: String,
      index: true,
      unique: true,
    },
    userId: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", ApplicationSchema);
