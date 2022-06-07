const deploymentConnection = require("../../models/deploymentConnection");

const deploymentConnectionDump = async (req, res) => {
  res.status(200).json(await deploymentConnectionDumpService(getDocument(req)));
};

const deploymentConnectionDumpService = async (docs) => {
  try {
    const bulk = await deploymentConnection.collection.initializeUnorderedBulkOp();
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
    bulk.insert(docs[i]);
  }
}

module.exports = {
  deploymentConnectionDump,
  deploymentConnectionDumpService,
};
