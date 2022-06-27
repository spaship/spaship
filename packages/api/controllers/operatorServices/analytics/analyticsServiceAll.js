const getCounts = require("./utils/getCountDeployments");
const getCountByEnvWeeklyChart = require("./utils/getCountByEnvWeeklyChart");
const getLatestActivities = require("./utils/getLatestActivities");

const analyticsServiceAll = async (req, res) => {
  try {
    const response = await propertyFilteration(req.body);
    if (response.length === 0) return res.status(200).json({ message: "No data avaliable." });
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

const propertyFilteration = async (request) => {
  console.log(request);
  if (request?.count) {
    if (request?.count?.all == true) {
      return await getCounts.getCountService(
        { code: "WEBSITE_CREATETED" },
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
          code: "WEBSITE_CREATETED",
        },
        {
          env: "$env",
        },
        {
          _id: 0,
          env: "$_id.env",
          count: "$count",
        }
      );
    } else if (request?.chart.all == true) {
      return await getCountByEnvWeeklyChart.getCountByEnvWeeklyChartService(
        {
          code: "WEBSITE_CREATETED",
        },
        {
          env: "$env",
        },
        {
          _id: 0,
          spaName: "$_id.spaName",
          env: "$_id.env",
          count: "$count",
        }
      );
    } else if (request?.activities.all == true) {
      return await getCountByEnvWeeklyChart.getCountByEnvWeeklyChartService(
        {
          code: "WEBSITE_CREATETED",
        },
        {
          env: "$env",
        },
        {
          _id: 0,
          spaName: "$_id.spaName",
          env: "$_id.env",
          count: "$count",
        }
      );
    }
  } else if (request?.activities.all == true) {
    return await getLatestActivities.getLatestActivitiesService(
      { code: "WEBSITE_CREATETED" },
      { limit: getLimit(request) },
      { skip: getSkip(request) }
    );
  }
};

function getLimit(request) {
  return parseInt(request?.activities.limit) || 15;
}

function getSkip(request) {
  return parseInt(request?.activities.skip) || 0;
}

module.exports = { analyticsServiceAll };
