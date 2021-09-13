const chart = require('../../../../models/event')

module.exports = async function getDeploymentCountForAllProperty(req, res) {
  try {
    const response = await chart.aggregate([
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

    let i = 1;
    var map = {};
    response.forEach((item) => {
      map[item.propertyName] = item.count
      item.id = i++;
    });

    res.status(200).json(response);

  } catch (e) {
    return { "Error": e };
  }
}