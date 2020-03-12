// if we're using a mocked mongodb...
const config = require("../config");

const mongodb = require("mongo-mock");
mongodb.max_delay = 0; //you can choose to NOT pretend to be async (default is 400ms)
const MongoClient = mongodb.MongoClient;
MongoClient.persist = "mock-db.js"; //persist the data to disk

// Connection URL
const connectUrls = ["mongodb://"];
if (config.get("db:mongo:user") && config.get("db:mongo:password")) {
  connectUrls.push(`${config.get("db:mongo:user")}:${config.get("db:mongo:password")}@`);
}
connectUrls.push(config.get("db:mongo:url"));
connectUrls.push(`/${config.get("db:mongo:db_name")}`);
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
