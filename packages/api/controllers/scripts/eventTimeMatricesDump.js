const eventTimeTrace = require("../../models/eventTimeTrace");

const eventTimeMatricesDump = async (req, res) => {
  res.status(200).json(await eventTimeMatricesDumpService(getDocument(req)));
};

const eventTimeMatricesDumpService = async (docs) => {
  try {
    const bulk = await eventTimeTrace.collection.initializeUnorderedBulkOp();
    const currentDate = new Date();
    await createBulkRequest(docs, currentDate, bulk);
    await bulk.execute();
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

async function createBulkRequest(docs, currentDate, bulk) {
  for (i = 0; i < getDocumentCounts(docs); i += 1) {
    docs[i]._id = null;
    if (docs[i].createdAt && docs[i].completedAt) {
      docs[i].createdAt = new Date(docs[i].createdAt.$date);
      docs[i].completedAt = new Date(docs[i].completedAt.$date);
      bulk.insert(docs[i]);
    }
  }
}

module.exports = { eventTimeMatricesDump, eventTimeMatricesDumpService };
