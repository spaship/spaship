/**
 * @see http://mongodb.github.io/node-mongodb-native/3.5/reference/ecmascriptnext/crud
 */

const config = require("../config");

if (config.get("db:mongo:mock")) {
  module.exports = require("./db.mock-mongo.js");
} else {
  module.exports = require("./db.real-mongo.js");
}
