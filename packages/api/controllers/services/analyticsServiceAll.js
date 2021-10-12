const getCounts = require("../webPropertyServices/getCountDeployments");
const getCountByEnvWeeklyChart = require("../webPropertyServices/getCountByEnvWeeklyChart");

const analyticsServiceAll = async (req, res) => {
  res.status(200).json(await propertyFilteration(req.body));
};

const propertyFilteration = async (request) => {
  if (request?.count) {
    if (request?.count?.all == true) {
      return await getCounts.getCountService(
        { code: "WEBSITE_CREATE" },
        {
          propertyName: "$propertyName",
          code: "$code",
        },
        {
          _id: 0,
          propertyName: "$_id.propertyName",
          code: "$_id.code",
          count: "$count",
        }
      );
    } else if (request?.count?.code == true) {
      return await getCounts.getCountService(
        {},
        {
          propertyName: "$propertyName",
          code: "$code",
        },
        {
          _id: 0,
          propertyName: "$_id.propertyName",
          code: "$_id.code",
          count: "$count",
        }
      );
    } else if (request?.count?.spa == true) {
      return await getCounts.getCountService(
        {},
        {
          propertyName: "$propertyName",
          spaName: "$spaName",
        },
        {
          _id: 0,
          propertyName: "$_id.propertyName",
          spaName: "$_id.spaName",
          count: "$count",
        }
      );
    }
  } else if (request?.chart) {
    if (request?.chart.all == true && request?.chart.property == true && request?.chart.spa == true) {
      return await getCounts.getCountService(
        {},
        {
          propertyName: "$propertyName",
          spaName: "$spaName",
          code: "$code",
        },
        {
          _id: 0,
          propertyName: "$_id.propertyName",
          spaName: "$_id.spaName",
          code: "$_id.code",
          count: "$count",
        }
      );
    } else if (request?.chart.all == true && request?.chart.property == true) {
      return await getCounts.getCountService(
        {
          code: "WEBSITE_CREATE",
        },
        {
          envs: "$envs",
        },
        {
          _id: 0,
          envs: "$_id.envs",
          count: "$count",
        }
      );
    } else if (request?.chart.all == true) {
      return await getCountByEnvWeeklyChart.getCountByEnvWeeklyChartService(
        {
          code: "WEBSITE_CREATE",
        },
        {
          envs: "$envs",
        },
        {
          _id: 0,
          spaName: "$_id.spaName",
          envs: "$_id.envs",
          count: "$count",
        }
      );
    }
  }
};

module.exports = { analyticsServiceAll };