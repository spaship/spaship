const chart = require('../../../models/event')

module.exports = async function getPropertyCountBySpanameAndCode(req, res) {
  try {

    const propertyCountBySpanameAndCodeResponse = await chart.aggregate([
      {
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
      },
      {
        '$project': {
          '_id': 0,
          'propertyName': '$_id.propertyName',
          'spaName': '$_id.spaName',
          'code': '$_id.code',
          'count': '$count'
        }
      },
      {
        $sort: { propertyName: 1, spaName: 1, code: 1 }
      }
    ]);

    let i = 1;
    propertyCountBySpanameAndCodeResponse.forEach((item) => {
      item.id = i++;
    });
    
    res.status(200).json(propertyCountBySpanameAndCodeResponse);

  } catch (e) {
    return { "Error": e };
  }
}