const chart = require('../../../../models/event')

module.exports = async function getCountByEnvChart(req, res) {
  try {
    const response = await chart.aggregate([
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

    res.status(200).json(response);

  } catch (e) {
    return { "Error": e };
  }
}