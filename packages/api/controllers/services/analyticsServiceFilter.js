const getTimeFrameForPropertyChart = require("../webPropertyServices/utils/getTimeFrameForPropertyChart");
const getLatestActivities = require("../webPropertyServices/getLatestActivities");
const getCountByEnvWeeklyChart = require("../webPropertyServices/getCountByEnvWeeklyChart");
const getCounts = require("../webPropertyServices/getCountDeployments");

const analyticsServiceFilter = async (req, res) => {
  res.status(200).json(await analyticsOperations(req.body));
};

const analyticsOperations = async (request) => {
  if (request?.count) {
    if (getPropertyName(request?.count) && getSpaName(request?.count)) {
      return await getCounts.getCountService(
        {
          code: "WEBSITE_CREATE",
          propertyName: getPropertyName(request?.count),
          spaName: getSpaName(request?.count),
        },
        {
          propertyName: "$propertyName",
          spaName: "$spaName",
          code: "$code",
          envs: "$envs",
        },
        {
          _id: 0,
          propertyName: "$_id.propertyName",
          spaName: "$_id.spaName",
          code: "$_id.code",
          env: "$_id.envs",
          count: "$count",
        }
      );
    } else if (getPropertyName(request?.count)) {
      return await getCounts.getCountService(
        {
          code: "WEBSITE_CREATE",
          propertyName: getPropertyName(request?.count),
        },
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
    }
  } else if (request?.activities) {
    if (getPropertyName(request?.chart) && getSpaName(request?.activities)) {
      return await getLatestActivities.getLatestActivitiesService({
        propertyName: getPropertyName(request?.activities),
        spaName: getSpaName(request?.activities),
      });
    } else if (request?.activities.propertyName) {
      return await getLatestActivities.getLatestActivitiesService({
        propertyName: getPropertyName(request?.activities),
      });
    }
  } else if (request?.chart) {
    if (getMonth(request) == true && getPropertyName(request?.chart) && getSpaName(request?.chart)) {
      return await getCountByEnvWeeklyChart.getCountByEnvWeeklyChartService(
        {
          code: "WEBSITE_CREATE",
          propertyName: getPropertyName(request?.chart),
          spaName: getSpaName(request?.chart),
        },
        {
          spaName: getSpaName(request?.chart),
          envs: "$envs",
        },
        {
          _id: 0,
          spaName: "$_id.spaName",
          envs: "$_id.envs",
          count: "$count",
        }
      );
    } else if (request?.chart.month == true && getPropertyName(request?.chart)) {
      return await getCountByEnvWeeklyChart.getCountByEnvWeeklyChartService(
        {
          code: "WEBSITE_CREATE",
          propertyName: getPropertyName(request?.chart),
        },
        {
          propertyName: getPropertyName(request?.chart),
          envs: "$envs",
        },
        {
          _id: 0,
          propertyName: "$_id.propertyName",
          envs: "$_id.envs",
          count: "$count",
        }
      );
    } else if (getPropertyName(request?.chart) && getSpaName(request?.chart)) {
      return await getCounts.getCountByEnvChartService(
        {
          code: "WEBSITE_CREATE",
          propertyName: getPropertyName(request?.chart),
          spaName: getSpaName(request?.chart),
        },
        {
          spaName: getSpaName(request?.spaName),
          envs: "$envs",
        },
        {
          _id: 0,
          spaName: "$_id.spaName",
          envs: "$_id.envs",
          count: "$count",
        }
      );
    } else if (getPropertyName(request?.chart)) {
      return await getCounts.getCountByEnvChartService(
        {
          propertyName: getPropertyName(request?.chart),
        },
        {
          propertyName: getPropertyName(request?.chart),
          envs: "$envs",
        },
        {
          _id: 0,
          propertyName: "$_id.propertyName",
          envs: "$_id.envs",
          count: "$count",
        }
      );
    }
  } else if (getTimerFrame(request)) {
    return await getTimeFrameForPropertyChart.getTimeFrameForPropertyChartService(getPropertyName(request?.timerframe));
  }
  return { message: "Please enter the valid input !" };
};

module.exports = { analyticsServiceFilter };

function getMonth(request) {
  return request?.chart.month;
}

function getTimerFrame(request) {
  return request?.timerframe;
}

function getSpaName(request) {
  return request?.spaName;
}

function getPropertyName(request) {
  return request?.propertyName;
}
