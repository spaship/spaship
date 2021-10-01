const chart = require("../../../models/event");


const getPropertyCountByEnvWeeklyChart = async (req, res) => {
  res.send(await getPropertyCountByEnvWeeklyChartService(req.sanitize(req.params.propertyName)));
};

const getPropertyCountByEnvWeeklyChartService = async (propertyName) => {
  try {
    const dateFrame = createDateFrame();
    const response = await fetchResponse(dateFrame, propertyName);
    return response;
  } catch (e) {
    return { Error: e };
  }
};

function createDateFrame() {
  const dateFrame = [];
  let recentDate = new Date();
  for (let i = 1; i <= 4; i++) {
    const endDate = recentDate;
    const startDate = new Date(recentDate);
    startDate.setDate(recentDate.getDate() - 7);
    dateFrame.push({ startDate: startDate, endDate: endDate });
    recentDate = startDate;
  }
  return dateFrame;
}

async function fetchResponse(dateFrame, propertyName) {
  const response = [];
  for (let i = 0; i < (await dateFrame.length); i++) {
    const element = {
      startDate: dateFrame[i].startDate,
      endDate: dateFrame[i].endDate,
    };
    const responseChart = await getWeeklyReport(element.startDate, element.endDate, propertyName);
    responseChart.forEach((item) => {
      item.startDate = element.startDate;
      item.endDate = element.endDate;
    });
    response.push(responseChart);
  }
  return response;
}

async function getWeeklyReport(startDate, endDate, propertyName) {
  return await chart.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $match: {
        propertyName: propertyName,
        code: "WEBSITE_CREATE",
      },
    },
    {
      $group: {
        _id: {
          propertyName: propertyName,
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

module.exports = { getPropertyCountByEnvWeeklyChart, getPropertyCountByEnvWeeklyChartService };
