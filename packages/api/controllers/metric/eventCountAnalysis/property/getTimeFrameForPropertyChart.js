const chart = require('../../../../models/eventTimeTrace')

module.exports = async function getTimeFrameForPropertyChart(req, res) {
  try {
    const spaName = req.params.propertyName;
    const dateFrame = createDateFrame();
    const response = await fetchResponse(dateFrame, spaName);

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

async function fetchResponse(dateFrame, propertyName) {
  const response = [];
  for (let i = 0; i < await dateFrame.length; i++) {
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
    '$match': {
      'completedAt': {
        '$gte': startDate,
        '$lt': endDate
      }
    }
  }, {
    '$match': {
      'propertyName': propertyName
    }
  }, {
    '$group': {
      '_id': {
        'propertyName': '$propertyName', 
        'envs': '$envs'
      }, 
      'totalAmount': {
        '$sum': '$consumedTime'
      }, 
      'count': {
        '$sum': 1
      }
    }
  }, {
    '$addFields': {
      'avg': {
        '$divide': [
          '$totalAmount', '$count'
        ]
      }
    }
  }, {
    '$project': {
      '_id': 0, 
      'propertyName': '$_id.propertyName', 
      'envs': '$_id.envs', 
      'totalAmount': '$totalAmount', 
      'count': '$count', 
      'avg': {
        '$round': [
          '$avg', 2
        ]
      }
    }
  },
  {
    $sort: { envs: 1 }
  }
  ]);
}
