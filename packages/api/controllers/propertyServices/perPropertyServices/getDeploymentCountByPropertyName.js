const chart = require("../../../models/event");

const getDeploymentCountByPropertyName = async (req, res) => {
  res.status(200).json(await getDeploymentCountByPropertyNameService(req.sanitize(req.params.propertyName)));
};

const getDeploymentCountByPropertyNameService = async (propertyName) => {
  try {
    const response = await fetchDeploymentCountByPropertyName(propertyName);
    let i = 1;
    response.forEach((item) => {
      item.id = i++;
    });
    return response;
  } catch (e) {
    return { Error: e };
  }
};

async function fetchDeploymentCountByPropertyName(propertyName) {
  return await chart.aggregate([
    {
      $match: {
        propertyName: propertyName,
        code: "WEBSITE_CREATE",
      },
    },
    {
      $group: {
        _id: {
          propertyName: "$propertyName",
          spaName: "$spaName",
          code: "$code",
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        propertyName: "$_id.propertyName",
        spaName: "$_id.spaName",
        code: "$_id.code",
        count: "$count",
      },
    },
    {
      $sort: { propertyName: 1, spaName: 1 },
    },
  ]);
}

module.exports = { getDeploymentCountByPropertyName, getDeploymentCountByPropertyNameService };
