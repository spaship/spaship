const chart = require('../../../../models/event')

module.exports = async function getLatestActivitiesBySPAName(req, res) {
  try {
    const response = await chart.aggregate([
      {
        '$match': {
          'propertyName':  req.params.propertyName,
          'spaName': req.params.spaName
        }
      }, {
        '$sort': {
          'createdAt': -1
        }
      }, {
        '$project': {
          'spaName': '$spaName', 
          'propertyName': '$propertyName', 
          'code': '$code', 
          'branch': '$branch', 
          'envs': '$envs', 
          'createdAt': '$createdAt', 
          '_id': 0
        }
      }, {
        '$limit': 10
      }
    ]);

    var codeMap = {
      "WEBSITE_CREATE": "deployed over", "WEBSITE_DELETE": "deleted from", "WEBSITE_UPDATE": "updated from"
    };
    let i = 1;

    response.forEach((item) => {
      item.id = i++;
      actvitiesText(item, codeMap);
    });

    res.status(200).json(response);

  } catch (e) {
    return { "Error": e };
  }
}

function actvitiesText(item, codeMap) {
  item.latestActivityHead = " has been " + codeMap[item.code] + " ";
  item.latestActivityTail = " at "
    + item.createdAt.toString().slice(0, 24) + " in " + item.envs;
}
