const eventTimeTrace = require('../../models/eventTimeTrace');

module.exports = async function eventTimeMatricesDump(req, res) {
  try {
    var docs = req.body;
    var bulk = eventTimeTrace.collection.initializeUnorderedBulkOp();
    const currentDate = new Date();
    createBulkRequest(docs, currentDate, bulk);
    bulk.execute();
    res.status(200).json({ "Success": "All data successfully updated", "Records Number": docs.length })
  } catch (e) {
    console.log(e);
    res.status(200).json({ "Error": e })
  };
}

function createBulkRequest(docs, currentDate, bulk) {
  for (i = 0; i < docs.length; i += 1) {
    docs[i]._id = null;
    if (docs[i].createdAt && docs[i].completedAt) {
      docs[i].createdAt = new Date(docs[i].createdAt.$date);
      docs[i].completedAt = new Date(docs[i].completedAt.$date);
      console.log(docs[i]);
      bulk.insert(docs[i]);
    }
  }
}
