const chart = require('../../../models/event')

const getSPANameCountByEnvChart = async (req, res) => {
    res.status(200).json(await getSPANameCountByEnvChartService(req.params.propertyName, req.params.spaName));
}

const getSPANameCountByEnvChartService = async (propertyName,spaName) => {
  try {
    const response = await fetchSPANameCountByEnvChart(propertyName,spaName);
    return response;
  } catch (e) {
    return { "Error": e };
  }
}

async function fetchSPANameCountByEnvChart(propertyName,spaName) {
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
          'spaName': "$spaName",
          'envs': '$envs'
        },
        'count': {
          '$sum': 1
        }
      }
    }, {
      '$project': {
        '_id': 0,
        'spaName': '$_id.spaName',
        'envs': '$_id.envs',
        'count': '$count'
      }
    },
    {
      $sort: { envs: 1 }
    }
  ]);
}

module.exports = { getSPANameCountByEnvChart, getSPANameCountByEnvChartService };