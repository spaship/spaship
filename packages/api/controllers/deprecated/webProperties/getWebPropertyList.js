const webProperty = require("../../../models/webProperty");

const getWebPropertyList = async (req, res, next) => {
  try {
    const response = await getWebPropertyListService();
    if (response.length === 0) return res.status(200).json({ message: "No data avaliable." });
    res.status(200).json(response);
  } catch (e) {
    next(err);
  }
};

const getWebPropertyListService = async (req, res, next) => {
  try {
    const response = await fetchResponse();
    bindResponse(response);
    return response;
  } catch (e) {
    next(err);
  }
};

function bindResponse(response) {
  response.forEach((item, i) => {
    item.id = i++;
  });
}

async function fetchResponse() {
  return await webProperty.aggregate([
    {
      $group: {
        _id: {
          webPropertyName: "$webPropertyName",
        },
      },
    },
    {
      $project: {
        _id: 0,
        webPropertyName: "$_id.webPropertyName",
      },
    },
    {
      $sort: { webPropertyName: 1 },
    },
  ]);
}

module.exports = { getWebPropertyList: getWebPropertyList, getWebPropertyListService: getWebPropertyListService };
