const chart = require('../../../models/event')

module.exports = async function getPropertyCountByCode(req, res) {
  try {

    const propertyCountByCodeResponse = await chart.aggregate([
      {
        '$group': {
          '_id': {
            'propertyName': '$propertyName',
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
          'code': '$_id.code',
          'count': '$count'
        }
      },
      {
        $sort: {propertyName : 1, code: 1}
      }
    ]);

    let i=1;
    propertyCountByCodeResponse.forEach( (item) =>  {
      item.id = i++;
    });

    console.log(propertyCountByCodeResponse);

    
    res.status(200).json(propertyCountByCodeResponse);

  } catch (e) {
    return { "Error": e };
  }
}