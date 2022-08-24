const apiKey = require("../../models/apiKey");

const apiKeysDump = async (req, res) => {
  res.status(200).json(await apiKeysDumpService(getDocument(req)));
};

const apiKeysDumpService = async (docs) => {
  try {
    const bulk = await apiKey.collection.initializeUnorderedBulkOp();
    createBulkData(docs, bulk);
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

function createBulkData(docs, bulk) {
  for (i = 0; i < getDocumentCounts(docs); i += 1) {
    docs[i].createdAt = new Date(docs[i].createdAt);
    docs[i].updatedAt = new Date(docs[i].updatedAt);
    docs[i].expiredDate = new Date(docs[i].expiredDate);
    console.log(docs[i]);
    bulk.insert(docs[i]);
  }
}

module.exports = {
  apiKeysDump,
  apiKeysDumpService,
};
