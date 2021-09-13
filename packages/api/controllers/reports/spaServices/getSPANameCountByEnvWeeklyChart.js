const chart = require('../../../models/event')

module.exports = async function getSPANameCountByEnvWeeklyChart(req, res) {
  try {
    const spaName = req.params.spaName;
    const propertyName = req.params.propertyName;
    const dateFrame = createDateFrame();
    const response = await fetchResponse(dateFrame, spaName, propertyName);

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

async function fetchResponse(dateFrame, spaName, propertyName) {
  const response = [];
  for (let i = 0; i < await dateFrame.length; i++) {
    const element = {
      startDate: dateFrame[i].startDate,
      endDate: dateFrame[i].endDate,
    };
    const responseChart = await getWeeklyReport(element.startDate, element.endDate, spaName, propertyName);
    responseChart.forEach((item) => {
      item.startDate = element.startDate;
      item.endDate = element.endDate;
    });
    response.push(responseChart);
  }
  return response;
}

async function getWeeklyReport(startDate, endDate, spaName, propertyName ) {
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
        'propertyName': propertyName,
        'spaName': spaName,
        'code': 'WEBSITE_CREATE'
      }
    }, {
      '$group': {
        '_id': {
          'spaName': spaName,
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
