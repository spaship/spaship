const webProperty = require("../../../models/webProperty");

const getSPAList = async (req, res, next) => {
  try {
    const response = await getSPAListService(req.params.webPropertyName);
    if (response.length === 0) return res.status(200).json({ message: "No data avaliable." });
    res.status(200).json(response);
  } catch (err) {
    next(err);
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
