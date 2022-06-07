const deploymentRecord = require("../../../models/deploymentRecord");
const ValidationError = require("../../../utils/errors/ValidationError");

const saveDeploymentRecord = async (req, res, next) => {
  const request = req.body;
  if (checkProperties(request)) {
    return next(new ValidationError("Missing properties in request body"));
  }
  if (getDeploymentRecordId(request)) {
    const updatedResponse = await updatesaveDeploymentRecord(request, next);
    if (updatedResponse) return res.send(updatedResponse);
  }
  const result = await deploymentRecord.findOne({ propertyName: getPropertyName(request), type: getType(request) });
  if (result) {
    return next(new ValidationError("Property Name is already mapped for this env."));
  }
  let deploymentRecordRequest = await createDeploymentRecordRequest(request);
  const createdResponse = await createDeploymentRecord(deploymentRecordRequest);
  res.send(createdResponse);
};

function checkProperties(request) {
  return (
    !request.hasOwnProperty("propertyName") ||
    !request.hasOwnProperty("deploymentConnectionName") ||
    !request.hasOwnProperty("baseurl") ||
    !request.hasOwnProperty("type")
  );
}

const createDeploymentRecord = async (ddeploymentRecordType) => {
  try {
    const saveResponse = await ddeploymentRecordType.save();
    return saveResponse;
  } catch (e) {
    return { Error: e };
  }
};

async function createDeploymentRecordRequest(req) {
  return new deploymentRecord({
    propertyName: getPropertyName(req),
    deploymentConnectionName: getDeploymentConnectionName(req),
    baseurl: getBaseurl(req),
    type: getType(req),
  });
}

async function updatesaveDeploymentRecord(request, next) {
  const updateData = { ...request };
  const updateResponse = await deploymentRecord.findOneAndUpdate({ _id: request?._id }, updateData, (error, data) => {
    if (error) {
      next(new ValidationError("Validation Error"));
    }
  });
  return updateResponse;
}

function getBaseurl(req) {
  return req?.baseurl.trim();
}

function getDeploymentConnectionName(req) {
  return req?.deploymentConnectionName.trim().toLowerCase() || "";
}

function getType(req) {
  return req?.type.trim().toLowerCase() || "";
}

function getDeploymentRecordId(req) {
  return req?._id;
}

function getPropertyName(req) {
  return req?.propertyName.trim();
}

module.exports = { saveDeploymentRecord, createDeploymentRecord };
