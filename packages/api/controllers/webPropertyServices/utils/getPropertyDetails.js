const application = require("../../../models/application");

const getPropertyDetails = async (req, res, next) => {
  try {
    if (req.params.name) res.status(200).json(await getPropertyDetailsService(req.sanitize(req.params.name)));
    else res.status(200).json(await application.find());
  } catch (err) {
    next(err);
  }
};

const getPropertyDetailsService = async (name) => {
  const response = await fetchSearchResultForSPA(name);
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

async function fetchSearchResultForSPA(name) {
  return await application.aggregate([
    {
      $match: {
        propertyName: name,
      },
    },
    {
      $project: {
        propertyName: "$propertyName",
        name: "$name",
        path: "$path",
        ref: "$ref",
        env: "$env",
      },
    },
    {
      $sort: { propertyName: 1, name: 1, env: 1 },
    },
  ]);
}

module.exports = { getPropertyDetails, getPropertyDetailsService };
