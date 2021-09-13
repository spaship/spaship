const chart = require('../../../../models/event')

module.exports = async function getPropertyCountBySpaname(req, res) {
  try {

    const propertyCountBySpanameResponse = await fetchPropertyCountBySpanameResponse();
    bindResponse(propertyCountBySpanameResponse);
    res.status(200).json(propertyCountBySpanameResponse);

  } catch (e) {
    return { "Error": e };
  }
}

function bindResponse(propertyCountBySpanameResponse) {
  let i = 1;
  propertyCountBySpanameResponse.forEach((item) => {
    item.id = i++;
  });
}

async function fetchPropertyCountBySpanameResponse() {
  return await chart.aggregate([
    {
      '$group': {
        '_id': {
          'propertyName': '$propertyName',
          'spaName': '$spaName'
        },
        'count': {
          '$sum': 1
        }
      },
    },
    {
      '$project': {
        '_id': 0,
        'propertyName': '$_id.propertyName',
        'spaName': '$_id.spaName',
        'count': '$count'
      }
    },
    {
      $sort: { propertyName: 1, spaName: 1 }
    }
  ]);
}
