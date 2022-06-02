const event = require("../../../models/event");

const getSearchResultForSPA = async (req, res, next) => {
  try {
    if (req.params.searchQuery)
      res.status(200).json(await getSearchResultForSPAService(req.sanitize(req.params.searchQuery)));
    else res.status(200).json(await event.find());
  } catch (err) {
    next(err);
  }
};

const getSearchResultForSPAService = async (searchQuery) => {
  const response = await fetchSearchResultForSPA(searchQuery);
  if (response.length === 0) return { message: "Searched SPA is not avaliable." };
  bindResponse(response);
  return response;
};

function bindResponse(response) {
  let i = 1;
  response.forEach((item) => {
    item.id = i++;
  });
}

async function fetchSearchResultForSPA(searchQuery) {
  return await event.aggregate([
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
