const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
  uuid: {
    type: String,
    index: true,
    unique: true,
  },
  email: String,
});

module.exports = mongoose.model("User", UserSchema);
