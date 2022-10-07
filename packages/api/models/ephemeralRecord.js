const mongoose = require("mongoose");

const ephemeralRecord = new mongoose.Schema(
  {
    propertyName: {
      type: String,
      required: true,
    },
    actionEnabled: {
      type: Boolean,
      required: true,
      default: false,
    },
    actionId: {
      type: String,
      required: true,
    },
    env: {
      type: String,
      required: true,
    },
    expiresIn: {
      type: Number,
      required: true,
    },
    agendaId: {
      type: String,
      required: false,
    },
    createdBy: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ephemeralRecord", ephemeralRecord);
