/**
 * @see http://mongodb.github.io/node-mongodb-native/3.5/reference/ecmascriptnext/crud
 */

const config = require("../config");

if (config.get("db:mongo:mock")) {
  module.exports = require("./db.mongo-mock.js");
} else {
  module.exports = require("./db.mongo.js");
}
