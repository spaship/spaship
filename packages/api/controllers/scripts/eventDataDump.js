const event = require('../../models/event')
const mongoose = require('mongoose');

module.exports = async function eventDataDump(req, res) {
  try {
    var docs = getDocument(req);
    var bulk = event.collection.initializeUnorderedBulkOp();
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
    if (docs[i].createdAt) {
      docs[i].createdAt = new Date(docs[i].createdAt.$date);
      console.log(docs[i]);
      bulk.insert(docs[i]);
    }
  }
}
