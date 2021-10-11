const chart = require("../../models/event");

const getLatestActivitiesService = async (request) => {
  try {
    const response = await fetchLatestActivitiesByProperty(request);
    bindResponse(response);
    return response;
  } catch (e) {
    return { Error: e };
  }
};

function bindResponse(response) {
  const codeMap = {
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

async function fetchLatestActivitiesByProperty(matchRequest) {
  return await chart.aggregate([
    {
      $match: matchRequest,
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

module.exports = { getLatestActivitiesService };
