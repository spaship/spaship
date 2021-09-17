const chart = require('../../../models/event')

const getLatestActivitiesBySPAName = async (req, res) => {
  try {
    res.status(200).json(await getLatestActivitiesBySPANameService(req.params.propertyName, req.params.spaName));
  } catch (e) {
    return { "Error": e };
  }
}

const getLatestActivitiesBySPANameService = async (propertyName, spaName) => {
  try {
    const response = await fetchLatestActivitiesBySPAName(propertyName, spaName);
    var codeMap = {
      "WEBSITE_CREATE": "deployed over", "WEBSITE_DELETE": "deleted from", "WEBSITE_UPDATE": "updated from"
    };
    let i = 1;
    response.forEach((item) => {
      item.id = i++;
      actvitiesText(item, codeMap);
    });
    return response;
  } catch (e) {
    return { "Error": e };
  }
}

async function fetchLatestActivitiesBySPAName(propertyName, spaName) {
  return await chart.aggregate([
    {
      '$match': {
        'propertyName': propertyName,
        'spaName': spaName
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
}

function actvitiesText(item, codeMap) {
  item.latestActivityHead = " has been " + codeMap[item.code] + " ";
  item.latestActivityTail = " at "
    + item.createdAt.toString().slice(0, 24) + " in " + item.envs;
}

module.exports = { getLatestActivitiesBySPAName, getLatestActivitiesBySPANameService };