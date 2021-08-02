const chart = require('../../../../models/event')

module.exports = async function getDeploymentCountBySPAName(req, res) {
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
        $sort: { env: 1}
      }
    ]);

    let i = 1;
    response.forEach((item) => {
      item.id = i++;
    });

    res.status(200).json(response);

  } catch (e) {
    return { "Error": e };
  }
}