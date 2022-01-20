const webProperty = require("../../models/webProperty");

const getWebPropertyList = async (req, res, next) => {
  try {
    res.send(await getWebPropertyListService());
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
