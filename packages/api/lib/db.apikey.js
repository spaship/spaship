const db = require("./db");
const uuidv4 = require("uuid").v4;
const shajs = require("sha.js");

async function attach() {
  const apikeys = await db.connect("apikeys");

  function hash(apikey) {
    return shajs("sha256")
      .update(apikey)
      .digest("hex");
  }

  async function createKey(userid = null) {
    const apikey = uuidv4();
    const doc = { userid, apikey };
    await storeKey(doc);
    return doc;
  }

  /**
   * Hash the api key and then store the record in the database.
   * @param {Object} doc { userid: "someUserId", apikey: "someApiKey" }
   */
  async function storeKey(doc) {
    return await apikeys.insertOne({
      userid: doc.userid,
      apikey: hash(doc.apikey)
    });
  }

  async function deleteKey(apikey) {
    const keys = await apikeys.find({ apikey: hash(apikey) }).toArray();
    const result = keys.length ? await apikeys.deleteMany({ apikey }) : { error: "Hashed key not found" };
    return result;
  }

  async function getKeysByUser(userid, limit = 100) {
    return await apikeys
      .find({ userid })
      .limit(limit)
      .toArray();
  }

  async function getUserByKey(apikey, limit = 100) {
    return await apikeys
      .find({ apikey: hash(apikey) })
      .limit(limit)
      .toArray();
  }

  async function deleteKeysByUser(userid) {
    const users = await apikeys.find({ userid }).toArray();
    const result = users.length ? await apikeys.deleteMany({ userid }) : { error: "User not found" };
    return result;
  }

  return { getKeysByUser, getUserByKey, deleteKeysByUser, createKey, deleteKey };
}

module.exports = { attach };
