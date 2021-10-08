const chart = require("../../../models/event");

const getSearchResultForSPA = async (req, res) => {
  res.status(200).json(await getSearchResultForSPAService(req.sanitize(req.params.searchQuery)));
};

const getSearchResultForSPAService = async (searchQuery) => {
  try {
    const response = await fetchSearchResultForSPA(searchQuery);
    bindResponse(response);
    return response;
  } catch (e) {
    return { Error: e };
  }
};

function bindResponse(response) {
  let i = 1;
  response.forEach((item) => {
    item.id = i++;
  });
}

async function fetchSearchResultForSPA(searchQuery) {
  return await chart.aggregate([
    {
      $group: {
        _id: {
          spaName: "$spaName",
          propertyName: "$propertyName",
        },
      },
    },
    {
      $project: {
        _id: 0,
        spaName: "$_id.spaName",
        propertyName: "$_id.propertyName",
      },
    },
    {
      $match: {
        spaName: {
          $regex: searchQuery,
          $options: "i",
        },
      },
    },
    {
      $sort: { spaName: 1, propertyName: 1 },
    },
  ]);
}

module.exports = { getSearchResultForSPA, getSearchResultForSPAService };
