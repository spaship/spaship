const db = require("./db");
const shortid = require("shortid");

async function attach() {
  const apikeys = await db.connect("apikeys");

  async function createKey(userid = null) {
    const apikey = shortid.generate();
    const doc = { userid, apikey };
    await apikeys.insertOne(doc);
    return doc;
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
      .find({ apikey })
      .limit(limit)
      .toArray();
  }

  return { getKeysByUser, getUserByKey, createKey, deleteKey };
}

module.exports = { attach };
