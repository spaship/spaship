const deploymentRecord = require("../../../models/deploymentRecord");
const activityStream = require("../../../models/activityStream");
const applications = require("../../../models/application");
const alias = require("../../../models/alias");
const uuidv4 = require("uuid").v4;
const axios = require("axios");
const NotFoundError = require("../../../utils/errors/NotFoundError");
const ValidationError = require("../../../utils/errors/ValidationError");

const deletePropertyEnv = async (req, res, next) => {
  try {
    console.log(req.body);
    if (checkProperties(req.body)) {
      return next(new ValidationError("Missing properties in request body"));
    }

    const propertyName = req.body?.propertyName;
    const env = req.body?.env;
    const type = req.body?.type;
    const source = req.body?.createdBy;

    const deploymentRecordResponse = await deploymentRecord.findOne({
      propertyName: propertyName,
      type: type,
    });

    if (!deploymentRecordResponse) {
      next(new NotFoundError("Property not found"));
      return;
    }

    const operatorPayload = {
      name: env,
      websiteName: propertyName,
      nameSpace: `spaship--${propertyName}`,
      websiteVersion: "v1",
    };
    const deploymentUrl = `${deploymentRecordResponse.baseurl}/api/environment/purge`;
    const response = await axios.post(deploymentUrl, operatorPayload);

    const toObject = true;
    const deleteAlias = await alias.findOne({ propertyName: propertyName, env: env }, null, { lean: toObject });
    const deleteApplication = await applications.find({ propertyName: propertyName, env: env }, null, {
      lean: toObject,
    });


    const applicationsActivityStream = [];
    const _delete = "DELETE";
    const dataAlias = new activityStream({
      id: uuidv4(),
      source: source || "",
      action: _delete,
      propertyName: deleteAlias?.propertyName || "",
      props: { env: deleteAlias?.env, spaName: "NA" },
    });
    for (let item of deleteApplication) {
      const data = {
        id: uuidv4(),
        source: source || "",
        action: _delete,
        propertyName: item?.propertyName.trim()?.toLowerCase() || "",
        props: { env: item?.env?.trim()?.toLowerCase(), spaName: item.name?.trim()?.toLowerCase() },
      };
      applicationsActivityStream.push(data);
    }
    await dataAlias.save();
    await activityStream.insertMany(applicationsActivityStream);

    console.log(deleteAlias);
    console.log(deleteApplication);

    const deleteCountAlias = await alias.findOne({ propertyName: propertyName, env: env }).remove().exec();
    const deleteCountApplication = await applications.findOne({ propertyName: propertyName, env: env }).remove().exec();

    console.log(deleteCountAlias);
    console.log(deleteCountApplication);

    res.status(200).json({ deleteAlias: deleteCountAlias, deleteApplication: deleteCountApplication });
  } catch (err) {
    next(err);
  }
};

function checkProperties(request) {
  return !request.hasOwnProperty("env") || !request.hasOwnProperty("propertyName") || !request.hasOwnProperty("type");
}

module.exports = { deletePropertyEnv };
