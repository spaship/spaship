const application = require("../../models/application");
const mongoose = require("mongoose");
const uuidv4 = require("uuid").v4;

const applicationsService = async (req, res) => {
  res.status(200).json(await applicationsDataDumpService(getDocument(req)));
};

const applicationsDataDumpService = async (docs) => {
  try {
    const bulk = await application.collection.initializeUnorderedBulkOp();
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
    docs[i].createdAt = currentDate;
    docs[i].updatedAt = currentDate;
    console.log(docs[i]);
    docs[i].name = docs[i].name.toString().toLowerCase().replace(/ /g, "-");
    bulk.insert(docs[i]);
  }
}

module.exports = { applicationsService, applicationsDataDumpService };
