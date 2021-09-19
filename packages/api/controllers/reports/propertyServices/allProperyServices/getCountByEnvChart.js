const chart = require('../../../../models/event')

const getCountByEnvChart = async (req, res) =>  {
    res.status(200).json(await getCountByEnvChartService());
}

const getCountByEnvChartService = async () =>  {
  try {
    const response = await fetchCountByEnv();
    return response;
  } catch (e) {
    return { "Error": e };
  }
}


async function fetchCountByEnv() {
  return await chart.aggregate([
    {
      '$match': {
        'code': 'WEBSITE_CREATE'
      }
    }, {
      '$group': {
        '_id': {
          'envs': '$envs'
        },
        'count': {
          '$sum': 1
        }
      }
    }, {
      '$project': {
        '_id': 0,
        'envs': '$_id.envs',
        'count': '$count'
      }
    },
    {
      $sort: { envs: 1 }
    }
  ]);
}

module.exports = { getCountByEnvChart, getCountByEnvChartService };