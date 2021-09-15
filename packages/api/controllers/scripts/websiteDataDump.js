const website = require('../../models/website')
const mongoose = require('mongoose');

module.exports = async function websiteDataDump(req, res) {
  try {
    var docs = getDocument(req);

    var bulk = website.collection.initializeUnorderedBulkOp();
    const currentDate = new Date();
    createBulkData(docs, currentDate, bulk);
    bulk.execute();
    res.status(200).json({ "Success": "All data successfully updated", "Records Number" : getDocumentCounts(docs) })
} catch (e) {
  console.log(e);
  res.status(200).json({ "Error": e })
};
}

function getDocumentCounts(docs) {
  return docs?.length || 0;
}

function getDocument(req) {
  return req?.body || [];
}

function createBulkData(docs, currentDate, bulk) {
  for (i = 0; i < getDocumentCounts(docs) ; i += 1) {
    docs[i]._id = null;
    if (docs[i].createdAt || docs[i].updatedAt) {
      docs[i].createdAt = new Date(docs[i].createdAt.$date);
      docs[i].updatedAt = new Date(docs[i].updatedAt.$date);
      console.log(docs[i]);
      bulk.insert(docs[i]);
    }
  }
}
