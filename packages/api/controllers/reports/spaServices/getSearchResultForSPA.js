const chart = require('../../../models/event')

module.exports = async function getSearchResultForSPA(req, res) {
  try {
    const response = await fetchSearchResultForSPA(req);
    bindResponse(response);
    res.status(200).json(response);

  } catch (e) {
    return { "Error": e };
  }
}

function bindResponse(response) {
  let i = 1;
  response.forEach((item) => {
    item.id = i++;
  });
}

async function fetchSearchResultForSPA(req) {
  return await chart.aggregate([
    {
      '$group': {
        '_id': {
          'spaName': '$spaName',
          'propertyName': '$propertyName'
        }
      }
    }, {
      '$project': {
        '_id': 0,
        'spaName': '$_id.spaName',
        'propertyName': '$_id.propertyName'
      }
    }, {
      '$match': {
        'spaName': {
          '$regex': req.params.searchQuery,
          '$options': 'i'
        }
      }
    },
    {
      $sort: { spaName: 1, propertyName: 1 }
    }
  ]);
}
