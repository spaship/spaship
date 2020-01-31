const db = require("./db");
const shortid = require("shortid");
const shajs = require("sha.js");

async function attach() {
  const apikeys = await db.connect("apikeys");

  function hash(apikey) {
    return shajs("sha256")
      .update(apikey)
      .digest("hex");
  }

  async function createKey(userid = null) {
    const apikey = shortid.generate();
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
    await apikeys.deleteMany({ apikey });
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

  return { getKeysByUser, getUserByKey, createKey, deleteKey };
}

module.exports = { attach };
