const chart = require('../../../../models/event')

module.exports = async function getCountByEnvWeeklyChart(req, res) {
  try {
    const dateFrame = createDateFrame();
    const response = await fetchResponse(dateFrame);

    res.send(response);
  } catch (e) {
    return { "Error": e };
  }
}

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

async function fetchResponse(dateFrame) {
  const response = [];
  for (let i = 0; i < await dateFrame.length; i++) {
    const element = {
      startDate: dateFrame[i].startDate,
      endDate: dateFrame[i].endDate,
    };
    const responseChart = await getWeeklyReport(element.startDate, element.endDate);
    responseChart.forEach((item) => {
      item.startDate = element.startDate;
      item.endDate = element.endDate;
    });
    response.push(responseChart);
  }
  return response;
}

async function getWeeklyReport(startDate, endDate) {
  return await chart.aggregate([
    {
      '$match': {
        'createdAt': {
          '$gte': startDate,
          '$lt': endDate
        }
      }
    }, {
      '$match': {
        'code': 'WEBSITE_CREATE'
      }
    }, {
      '$group': {
        '_id': {
          'envs': '$envs'
        },
        'count': {
          '$sum': 1
        }
      }
    }, {
      '$project': {
        '_id': 0,
        'spaName': '$_id.spaName',
        'envs': '$_id.envs',
        'count': '$count'
      }
    },
    {
      $sort: { envs: 1 }
    }
  ]);
}
