const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ApplicationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    path: {
      type: String,
      required: true,
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
