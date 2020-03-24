const config = require("../config");
const { log } = require("@spaship/common/lib/logging/pino");
const mongodb = require("mongodb");

// Connection URL
const connectUrls = ["mongodb://"];
if (config.get("db:mongo:user") && config.get("db:mongo:password")) {
  connectUrls.push(`${config.get("db:mongo:user")}:${config.get("db:mongo:password")}@`);
}
connectUrls.push(config.get("db:mongo:url"));
// connectUrls.push(`/${config.get("db:mongo:db")}`);
const url = connectUrls.join("");

log.info(`connecting to ${url}`);

const client = new mongodb.MongoClient(url, { useUnifiedTopology: true });

let reusableClient;

async function connect(collectionName) {
  if (!collectionName) {
    throw new Error("db.connect must be given a collection name");
  }

  // if a connection is already open, use it
  if (!reusableClient) {
    reusableClient = await client.connect();
  }

  // otherwise, connect
  let db = reusableClient.db(config.get("db:mongo:db_name"));
  return db.collection(collectionName);
}

module.exports = { connect };
