const chart = require("../../models/event");

const getCountService = async (matchRequest, groupRequest, projectRequest) => {
  try {
    const response = await getGetPropertyCountByEnvChart(matchRequest, groupRequest, projectRequest);
    return response;
  } catch (e) {
    return { Error: e };
  }
};

async function getGetPropertyCountByEnvChart(matchRequest, groupRequest, projectRequest) {
  return await chart.aggregate([
    {
      $match: matchRequest,
    },
    {
      $group: {
        _id: groupRequest,
        count: {
          $sum: 1,
        },
      },
    },
    {
      $project: projectRequest,
    },
  ]);
}

module.exports = { getCountService };
