const website = require('../../models/website')

const getWebsiteList = async (req, res) =>  {
  try {
    res.send(await getWebsiteListService());
  } catch (e) {
    return { "Error": e }; zz
  }
}

const getWebsiteListService = async (req, res) =>  {
  try {
    const response = await fetchResponse();
    bindResponse(response);
    return response;
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

module.exports = { getWebsiteList, getWebsiteListService };