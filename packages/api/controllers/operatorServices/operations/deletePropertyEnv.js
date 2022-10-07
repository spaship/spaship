const deploymentRecord = require("../../../models/deploymentRecord");
const activityStream = require("../../../models/activityStream");
const applications = require("../../../models/application");
const ephemeralRecord = require("../../../models/ephemeralRecord");
const alias = require("../../../models/alias");
const uuidv4 = require("uuid").v4;
const axios = require("axios");
const NotFoundError = require("../../../utils/errors/NotFoundError");
const ValidationError = require("../../../utils/errors/ValidationError");

const deletePropertyEnv = async (req, res, next) => {
  if (checkProperties(req.body)) {
    return next(new ValidationError("Missing properties in request body"));
  }
  try {
    const response = await deletePropertyEnvService(req.body);
    return res.status(200).json(response);
  }
  catch (e) {
    return next(new Error(e));
  }
};

const deletePropertyEnvService = async (req) => {

  try {
    console.log(req);
    const propertyName = req?.propertyName;
    const env = req?.env;
    const type = req?.type;
    const source = req?.createdBy;

    if (env == "prod") {
      console.log("Prod can't be deleted, please contact to the SPAship team.");
      throw new ValidationError("Prod can't be deleted, please contact to the SPAship team")
    }

    const deploymentRecordResponse = await deploymentRecord.findOne({
      propertyName: propertyName,
      type: type,
    });

    if (!deploymentRecordResponse) {
      console.log("Invalid Property Name");
      throw new NotFoundError("Invalid Property Name")
    }
    const toObject = true;
    const deleteAlias = await alias.findOne({ propertyName: propertyName, env: env }, null, { lean: toObject });
    if (!deleteAlias) {
      console.log("Env is already deleted or invalid");
      throw new NotFoundError("Please provide a valid environment name.")
    }

    const operatorPayload = {
      name: env,
      websiteName: propertyName,
      nameSpace: `spaship--${propertyName}`,
      websiteVersion: "v1",
    };
    const deploymentUrl = `${deploymentRecordResponse.baseurl}/api/environment/purge`;
    const response = await axios.post(deploymentUrl, operatorPayload);

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
      payload: JSON.stringify(deleteAlias)
    });
    for (let item of deleteApplication) {
      const data = {
        id: uuidv4(),
        source: source || "",
        action: _delete,
        propertyName: item?.propertyName.trim()?.toLowerCase() || "",
        props: { env: item?.env?.trim()?.toLowerCase(), spaName: item.name?.trim()?.toLowerCase() },
        payload: JSON.stringify(item)
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


    try {
      /*
      Remove ephemeral env from the record if exists
      */
      await ephemeralRecord.updateOne({ propertyName, env }, { isActive: false });
    }
    catch (e) {
      console.log(e);
      throw new Error(e);
    }

    return { deleteAlias: deleteCountAlias, deleteApplication: deleteCountApplication };
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

function checkProperties(request) {
  return !request.hasOwnProperty("env") || !request.hasOwnProperty("propertyName") || !request.hasOwnProperty("type");
}

module.exports = { deletePropertyEnv, deletePropertyEnvService };
