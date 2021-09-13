const website = require('../../models/website')

module.exports = async function getSPAList(req, res) {
  try {
    const getSPAListResponse = await fetchSPAList(req);

    let i = 1;
    getSPAListResponse.forEach((item) => {
      item.id = i++;
    });

    res.status(200).json(getSPAListResponse);

  } catch (e) {
    return { "Error": e };
  }
}
async function fetchSPAList(req) {
  return await website.aggregate([
    {
      '$match': {
        'websiteName': req.params.websiteName
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

