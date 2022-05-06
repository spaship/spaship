const alias = require("../../models/alias");
const mongoose = require("mongoose");
const uuidv4 = require("uuid").v4;

const aliasDataDump = async (req, res) => {
  res.status(200).json(await aliasDataDumpService(getDocument(req)));
};

const aliasDataDumpService = async (docs) => {
  try {
    const bulk = await alias.collection.initializeUnorderedBulkOp();
    const currentDate = new Date();
    createBulkData(docs, currentDate, bulk);
    bulk.execute();
    console.log(docs);
    return { Success: "All data successfully updated", "Records Number": getDocumentCounts(docs) };
  } catch (e) {
    console.log(e);
  }
};

function getDocumentCounts(docs) {
  return docs?.length || 0;
}

function getDocument(req) {
  return req?.body || [];
}

function createBulkData(docs, currentDate, bulk) {
  for (i = 0; i < getDocumentCounts(docs); i += 1) {
    docs[i]._id = null;
    if (docs[i].createdAt || docs[i].updatedAt) {
      docs[i].id = uuidv4();
      docs[i].createdAt = currentDate;
      docs[i].updatedAt = currentDate;
      console.log(docs[i]);
      bulk.insert(docs[i]);
    }
  }
}

module.exports = { aliasDataDump, aliasDataDumpService };
