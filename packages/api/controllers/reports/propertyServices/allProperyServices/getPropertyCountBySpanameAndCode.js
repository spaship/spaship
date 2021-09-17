const chart = require('../../../../models/event')

const getPropertyCountBySpanameAndCode = async (req, res) => {
  try {
    res.status(200).json(await getPropertyCountBySpanameAndCodeService());
  } catch (e) {
    return { "Error": e };
  }
}

const getPropertyCountBySpanameAndCodeService = async (req, res) => {
  try {
    const propertyCountBySpanameAndCodeResponse = await fetchPropertyCountBySpanameAndCodeResponse();
    bindResponse(propertyCountBySpanameAndCodeResponse);
    return propertyCountBySpanameAndCodeResponse;
  } catch (e) {
    return { "Error": e };
  }
}


function bindResponse(propertyCountBySpanameAndCodeResponse) {
  let i = 1;
  propertyCountBySpanameAndCodeResponse.forEach((item) => {
    item.id = i++;
  });
}

async function fetchPropertyCountBySpanameAndCodeResponse() {
  return await chart.aggregate([
    {
      '$group': {
        '_id': {
          'propertyName': '$propertyName',
          'spaName': '$spaName',
          'code': '$code'
        },
        'count': {
          '$sum': 1
        }
      }
    },
    {
      '$project': {
        '_id': 0,
        'propertyName': '$_id.propertyName',
        'spaName': '$_id.spaName',
        'code': '$_id.code',
        'count': '$count'
      }
    },
    {
      $sort: { propertyName: 1, spaName: 1, code: 1 }
    }
  ]);
}

module.exports = { getPropertyCountBySpanameAndCode, getPropertyCountBySpanameAndCodeService };