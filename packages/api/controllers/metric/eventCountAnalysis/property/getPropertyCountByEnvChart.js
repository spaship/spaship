const chart = require('../../../../models/event')

module.exports = async function getPropertyCountByEnvChart(req, res) {
  try {
    const response = await chart.aggregate([
      {
        '$match': {
          'propertyName': req.params.propertyName,
          'code': 'WEBSITE_CREATE'
        }
      }, {
        '$group': {
          '_id': {
            'propertyName': "$propertyName",
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