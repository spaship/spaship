const webProperty = require("../../models/webProperty");

const getSPAList = async (req, res) => {
  try {
    res.status(200).json(await getSPAListService(req.params.webPropertyName));
  } catch (e) {
    return { Error: e };
  }
};

const getSPAListService = async (webPropertyName) => {
  try {
    const getSPAListResponse = await fetchSPAList(webPropertyName);
    let i = 1;
    getSPAListResponse.forEach((item) => {
      item.id = i++;
    });
    return getSPAListResponse;
  } catch (e) {
    return { Error: e };
  }
};

async function fetchSPAList(webPropertyName) {
  return await webProperty.aggregate([
    {
      $match: {
        webPropertyName: webPropertyName,
      },
    },
    {
      $project: {
        _id: 0,
        createdAt: "$createdAt",
        webPropertyName: "$webPropertyName",
        repositoryConfigs: {
          $arrayElemAt: ["$repositoryConfigs", 0],
        },
      },
    },
    {
      $project: {
        createdAt: "$createdAt",
        webPropertyName: "$webPropertyName",
        repositoryConfigs: "$repositoryConfigs",
        spa: "$repositoryConfigs.spas",
      },
    },
  ]);
}

module.exports = { getSPAList, getSPAListService };
