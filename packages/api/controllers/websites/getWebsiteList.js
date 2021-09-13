const website = require('../../models/website')

module.exports = async function getWebsiteList(req, res) {
  try {
    console.log(res);
    const response = await fetchResponse();
    bindResponse(response);
    res.send(response);
  } catch (e) {
    return { "Error": e }; zz
  }
}

function bindResponse(response) {
  response.forEach((item, i) => {
    item.id = i++;
  });
}

async function fetchResponse() {
  return await website.aggregate([
    {
      '$group': {
        '_id': {
          'websiteName': '$websiteName'
        }
      }
    }, {
      '$project': {
        '_id': 0,
        'websiteName': '$_id.websiteName'
      }
    },
    {
      $sort: { websiteName: 1 }
    }
  ]);
}
