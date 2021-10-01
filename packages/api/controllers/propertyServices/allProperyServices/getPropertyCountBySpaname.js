const chart = require("../../../models/event");

const getPropertyCountBySpaname = async (req, res) => {
  res.status(200).json(await getPropertyCountBySpanameService());
};

const getPropertyCountBySpanameService = async (req, res) => {
  try {
    const propertyCountBySpanameResponse = await fetchPropertyCountBySpanameResponse();
    bindResponse(propertyCountBySpanameResponse);
    return propertyCountBySpanameResponse;
  } catch (e) {
    return { Error: e };
  }
};

function bindResponse(propertyCountBySpanameResponse) {
  let i = 1;
  propertyCountBySpanameResponse.forEach((item) => {
    item.id = i++;
  });
}

async function fetchPropertyCountBySpanameResponse() {
  return await chart.aggregate([
    {
      $group: {
        _id: {
          propertyName: "$propertyName",
          spaName: "$spaName",
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
        count: "$count",
      },
    },
    {
      $sort: { propertyName: 1, spaName: 1 },
    },
  ]);
}

module.exports = { getPropertyCountBySpaname, getPropertyCountBySpanameService };
