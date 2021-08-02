const chart = require('../../../../models/event')

module.exports = async function getSPANameCountByEnvChart(req, res) {
  try {
    const response = await chart.aggregate([
      {
        '$match': {
          'propertyName':  req.params.propertyName,
          'spaName': req.params.spaName,
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



    res.status(200).json(response);

  } catch (e) {
    return { "Error": e };
  }
}