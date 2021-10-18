const chart = require("../../models/event");

const getCountByEnvWeeklyChartService = async (matchRequest, groupRequest, projectRequest) => {
  try {
    const dateFrame = createDateFrame();
    const response = await fetchResponse(dateFrame, matchRequest, groupRequest, projectRequest);
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

async function fetchResponse(dateFrame, matchRequest, groupRequest, projectRequest) {
  const response = [];
  for (let i = 0; i < (await dateFrame.length); i++) {
    const element = {
      startDate: dateFrame[i].startDate,
      endDate: dateFrame[i].endDate,
    };
    const responseChart = await getWeeklyReport(
      element.startDate,
      element.endDate,
      matchRequest,
      groupRequest,
      projectRequest
    );
    responseChart.forEach((item) => {
      item.startDate = element.startDate;
      item.endDate = element.endDate;
    });
    response.push(responseChart);
  }
  return response;
}

async function getWeeklyReport(startDate, endDate, matchRequest, groupRequest, projectRequest) {
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
      $project: {
        _id: 0,
        spaName: "$_id.spaName",
        envs: "$_id.envs",
        count: "$count",
      },
    },
    {
      $sort: { envs: 1 },
    },
  ]);
}

module.exports = { getCountByEnvWeeklyChartService };
