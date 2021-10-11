const webProperty = require("../../models/webProperty");
const mongoose = require("mongoose");

const webPropertyDataDump = async (req, res) => {
  res.status(200).json(await webPropertyDataDumpService(req.sanitize(getDocument(req))));
};

const webPropertyDataDumpService = async (docs) => {
  try {
    const bulk = await webProperty.collection.initializeUnorderedBulkOp();
    const currentDate = new Date();
    createBulkData(docs, currentDate, bulk);
    bulk.execute();
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
      docs[i].createdAt = new Date(docs[i].createdAt.$date);
      docs[i].updatedAt = new Date(docs[i].updatedAt.$date);
      console.log(docs[i]);
      bulk.insert(docs[i]);
    }
  }
}

module.exports = { webPropertyDataDump, webPropertyDataDumpService };
