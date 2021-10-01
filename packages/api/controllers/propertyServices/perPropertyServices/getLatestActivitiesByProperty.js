const chart = require("../../../models/event");

const getLatestActivitiesByProperty = async (req, res) => {
  res.status(200).json(await getLatestActivitiesByPropertyService(req.sanitize(req.params.propertyName)));
};

const getLatestActivitiesByPropertyService = async (propertyName) => {
  try {
    const response = await fetchLatestActivitiesByProperty(propertyName);
    bindResponse(response);
    return response;
  } catch (e) {
    return { Error: e };
  }
};

function bindResponse(response) {
  var codeMap = {
    WEBSITE_CREATE: "deployed over",
    WEBSITE_DELETE: "deleted from",
    WEBSITE_UPDATE: "updated from",
  };
  let i = 1;
  response.forEach((item) => {
    item.id = i++;
    actvitiesText(item, codeMap);
  });
}

async function fetchLatestActivitiesByProperty(propertyName) {
  return await chart.aggregate([
    {
      $match: {
        propertyName: propertyName,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $project: {
        spaName: "$spaName",
        propertyName: "$propertyName",
        code: "$code",
        branch: "$branch",
        envs: "$envs",
        createdAt: "$createdAt",
        _id: 0,
      },
    },
    {
      $limit: 10,
    },
  ]);
}

function actvitiesText(item, codeMap) {
  item.latestActivityHead = " has been " + codeMap[item.code] + " ";
  item.latestActivityTail = " at " + item.createdAt.toString().slice(0, 24) + " in " + item.envs;
}

module.exports = { getLatestActivitiesByProperty, getLatestActivitiesByPropertyService };
