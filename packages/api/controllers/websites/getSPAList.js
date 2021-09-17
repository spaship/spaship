const website = require('../../models/website')

const getSPAList = async (req, res) =>  {
  try {
    res.status(200).json(await getSPAListService(req.params.websiteName));
  } catch (e) {
    return { "Error": e };
  }
}

const getSPAListService = async (websiteName) =>  {
  try {
    const getSPAListResponse = await fetchSPAList(websiteName);
    let i = 1;
    getSPAListResponse.forEach((item) => {
      item.id = i++;
    });
    return getSPAListResponse;
  } catch (e) {
    return { "Error": e };
  }
}

async function fetchSPAList(websiteName) {
  return await website.aggregate([
    {
      '$match': {
        'websiteName': websiteName
      }
    }, {
      '$project': {
        '_id': 0,
        'createdAt': '$createdAt',
        'websiteName': '$websiteName',
        'repositoryConfigs': {
          '$arrayElemAt': [
            '$repositoryConfigs', 0
          ]
        }
      }
    }, {
      '$project': {
        'createdAt': '$createdAt',
        'websiteName': '$websiteName',
        'repositoryConfigs': '$repositoryConfigs',
        'spa': '$repositoryConfigs.spas'
      }
    }
  ]);
}

module.exports = { getSPAList, getSPAListService };