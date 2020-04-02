const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const APIKeySchema = new Schema({
  label: {
    type: String,
    index: true,
    unique: true,
  },
  hashKey: String,
  expiredDate: Date,
  userId: String,
});

module.exports = mongoose.model("APIKey", APIKeySchema);
