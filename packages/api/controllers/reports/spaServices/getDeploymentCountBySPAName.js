const chart = require('../../../models/event')

const getDeploymentCountBySPAName = async (req, res) => {
    res.status(200).json(await getDeploymentCountBySPANameService(req.params.propertyName, req.params.spaName,));
}

const getDeploymentCountBySPANameService = async (propertyName, spaName) => {
  try {
    const response = await fetchDeploymentCountBySPAName(propertyName, spaName);
    bindResponse(response);
    return response;
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

async function fetchDeploymentCountBySPAName(propertyName, spaName) {
  return await chart.aggregate([
    {
      '$match': {
        'propertyName': propertyName,
        'spaName': spaName,
        'code': 'WEBSITE_CREATE'
      }
    }, {
      '$group': {
        '_id': {
          'propertyName': '$propertyName',
          'spaName': '$spaName',
          'code': '$code',
          'envs': '$envs'
        },
        'count': {
          '$sum': 1
        }
      }
    }, {
      '$project': {
        '_id': 0,
        'propertyName': '$_id.propertyName',
        'spaName': '$_id.spaName',
        'code': '$_id.code',
        'env': '$_id.envs',
        'count': '$count'
      }
    },
    {
      $sort: { env: 1 }
    }
  ]);
}

module.exports = { getDeploymentCountBySPAName, getDeploymentCountBySPANameService };