const chart = require("../../../models/event");

const getPropertyCountByCode = async (req, res) => {
  res.status(200).json(await getPropertyCountByCodeService());
};

const getPropertyCountByCodeService = async () => {
  try {
    const propertyCountByCodeResponse = await fetchPropertyCountByCodeResponse();
    bindResponse(propertyCountByCodeResponse);
    return propertyCountByCodeResponse;
  } catch (e) {
    return { Error: e };
  }
};

function bindResponse(propertyCountByCodeResponse) {
  let i = 1;
  propertyCountByCodeResponse.forEach((item) => {
    item.id = i++;
  });
}

async function fetchPropertyCountByCodeResponse() {
  return await chart.aggregate([
    {
      $group: {
        _id: {
          propertyName: "$propertyName",
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
        code: "$_id.code",
        count: "$count",
      },
    },
    {
      $sort: { propertyName: 1, code: 1 },
    },
  ]);
}

module.exports = { getPropertyCountByCode, getPropertyCountByCodeService };
