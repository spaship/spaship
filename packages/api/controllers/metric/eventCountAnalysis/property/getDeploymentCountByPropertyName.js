const chart = require('../../../../models/event')

module.exports = async function getDeploymentCountByPropertyName(req, res) {
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
            'propertyName': '$propertyName',
            'spaName': '$spaName',
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
          'spaName': '$_id.spaName',
          'code': '$_id.code',
          'count': '$count'
        }
      },
      {
        $sort: { propertyName: 1, spaName: 1 }
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