const chart = require("../../../models/event");

const getAllDeploymentPropertyAnalysis = async (req, res) => {
  res.status(200).json(await getAllDeploymentPropertyAnalysisService());
};

const getAllDeploymentPropertyAnalysisService = async () => {
  try {
    const propertyCountResponse = await getPropertyCountResponse();
    const propertyCountByCodeResponse = await getPropertyCountByCodeResponse();
    const propertyCountBySpanameAndCodeResponse = await getPropertyCountBySpanameAndCodeResponse();
    const propertyCountBySpanameResponse = await getPropertyCountBySpanameResponse();
    return [
      propertyCountResponse,
      propertyCountByCodeResponse,
      propertyCountBySpanameResponse,
      propertyCountBySpanameAndCodeResponse,
    ];
  } catch (e) {
    return { Error: e };
  }
};

async function getPropertyCountBySpanameResponse() {
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

async function getPropertyCountBySpanameAndCodeResponse() {
  return await chart.aggregate([
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
      $sort: { propertyName: 1, spaName: 1, code: 1 },
    },
  ]);
}

async function getPropertyCountByCodeResponse() {
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

async function getPropertyCountResponse() {
  return await chart.aggregate([
    {
      $group: {
        _id: "$propertyName",
        count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: { propertyName: 1, code: 1 },
    },
  ]);
}

module.exports = { getAllDeploymentPropertyAnalysis, getAllDeploymentPropertyAnalysisService };
