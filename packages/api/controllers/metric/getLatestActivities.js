const chart = require('../../models/event')

module.exports = async function getLatestActivities(req, res) {
  try {

    const latestPropertyActivityResponse = await chart.aggregate([
      {
        '$sort': {
          'createdAt': -1
        }
      }, {
        '$limit': 10
      }
      , {
        '$project': {
          'spaName': '$spaName',
          'propertyName': '$propertyName',
          'code': '$code',
          'branch': '$branch',
          'envs': '$envs',
          'createdAt': '$createdAt',
          '_id': 0
        }
      }
    ]);



    var codeMap = {
      "WEBSITE_CREATE": "deployed over", "WEBSITE_DELETE": "deleted from", "WEBSITE_UPDATE": "updated from"
    };
    let i = 1;


    latestPropertyActivityResponse.forEach((item) => {
      item.id = i++;
      actvitiesText(item, codeMap);
    });

    res.status(200).json(latestPropertyActivityResponse);

  } catch (e) {
    return { "Error": e };
  }
}

function actvitiesText(item, codeMap) {
  item.latestActivityHead = " has been " + codeMap[item.code] + " ";
  item.latestActivityTail = " at "
    + item.createdAt.toString().slice(0, 24) + " in " + item.envs;
}
