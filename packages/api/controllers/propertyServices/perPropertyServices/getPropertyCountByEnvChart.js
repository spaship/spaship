const chart = require("../../../models/event");

const getPropertyCountByEnvChart = async (req, res) => {
  res.status(200).json(await getPropertyCountByEnvChartService(req.sanitize(req.params.propertyName)));
};

const getPropertyCountByEnvChartService = async (propertyName) => {
  try {
    const response = await getGetPropertyCountByEnvChart(propertyName);
    return response;
  } catch (e) {
    return { Error: e };
  }
};

async function getGetPropertyCountByEnvChart(propertyName) {
  return await chart.aggregate([
    {
      $match: {
        propertyName: propertyName,
        code: "WEBSITE_CREATE",
      },
    },
    {
      $group: {
        _id: {
          propertyName: "$propertyName",
          envs: "$envs",
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        propertyName: "$_id.propertyName",
        envs: "$_id.envs",
        count: "$count",
      },
    },
    {
      $sort: { envs: 1 },
    },
  ]);
}

module.exports = { getPropertyCountByEnvChart, getPropertyCountByEnvChartService };
