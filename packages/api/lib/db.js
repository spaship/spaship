/**
 * @see http://mongodb.github.io/node-mongodb-native/3.5/reference/ecmascriptnext/crud
 */

const config = require("../config");

const mongoPkg = config.get("mock_db") ? "mongo-mock" : "mongodb";

const mongodb = require(mongoPkg);
mongodb.max_delay = 0; //you can choose to NOT pretend to be async (default is 400ms)
const MongoClient = mongodb.MongoClient;
MongoClient.persist = "mock-db.js"; //persist the data to disk

// Connection URL
const connectUrls = ["mongodb://"];
if (config.get("mongo_user") && config.get("mongo_password")) {
  connectUrls.push(`${config.get("mongo_user")}:${config.get("mongo_password")}@`);
}
connectUrls.push(config.get("mongo_url"));
connectUrls.push(`/${config.get("mongo_db")}`);
const url = connectUrls.join("");

let reusableClient;

async function connect(collectionName) {
  if (!collectionName) {
    throw new Error("db.connect must be given a collection name");
  }
  // if a connection is already open, use it
  if (reusableClient) {
    return reusableClient.collection(collectionName);
  }

  // otherwise, connect
  reusableClient = await MongoClient.connect(url, {});
  return reusableClient.collection(collectionName);
}

module.exports = { connect };
