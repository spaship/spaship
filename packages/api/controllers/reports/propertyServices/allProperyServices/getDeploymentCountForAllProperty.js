const chart = require('../../../../models/event')

const getDeploymentCountForAllProperty = async (req, res) => {
  try {
    res.status(200).json(await getDeploymentCountForAllPropertyService());
  } catch (e) {
    return { "Error": e };
  }
}

const getDeploymentCountForAllPropertyService = async (req, res) => {
  try {
    const response = await fetchResponse();
    let i = 1;
    var map = {};
    response.forEach((item) => {
      map[item.propertyName] = item.count
      item.id = i++;
    });
    return response;
  } catch (e) {
    return { "Error": e };
  }
}


async function fetchResponse() {
  return await chart.aggregate([
    {
      '$match': {
        'code': 'WEBSITE_CREATE'
      }
    }, {
      '$group': {
        '_id': {
          'propertyName': '$propertyName',
          'code': '$code'
        },
        'count': {
          '$sum': 1
        }
      }
    }, {
      '$project': {
        '_id': 0,
        'propertyName': '$_id.propertyName',
        'code': '$_id.code',
        'count': '$count'
      }
    },
    {
      $sort: { propertyName: 1, spaName: 1 }
    }
  ]);
}

module.exports = { getDeploymentCountForAllProperty, getDeploymentCountForAllPropertyService };