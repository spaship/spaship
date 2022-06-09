const deploymentConnection = require("../../../models/deploymentConnection");
const ValidationError = require("../../../utils/errors/ValidationError");

module.exports = async function saveDeploymentConnection(req, res, next) {
  const request = req.body;
  if (checkProperties(request)) {
    return next(new ValidationError("Missing properties in request body"));
  }
  if (!validateProperties(request, next)) return;
  if (getDeploymentConnectionId(request)) {
    const updatedResponse = await updatesaveDeploymentConnection(request, next);
    if (updatedResponse) return res.send(updatedResponse);
  }
  const result = await deploymentConnection.findOne({ name: getName(request) });
  if (result) {
    return next(new ValidationError("Deployment Connection Name exists."));
  }
  let deploymentConnectionRequest = await createDeploymentConnectionRequest(request);
  const createdResponse = await createDeploymentConnection(deploymentConnectionRequest);
  res.send(createdResponse);
};

function checkProperties(request) {
  return (
    !request.hasOwnProperty("name") ||
    !request.hasOwnProperty("baseurl") ||
    !request.hasOwnProperty("type") ||
    !request.hasOwnProperty("alias")
  );
}

function validateProperties(request, next) {
  const formatNameAndAlias = /[ `!@#$%^&*()+\=\[\]{};':"\\|,-.<>\/?~]/;
  const type = { prod: "prod", preprod: "preprod" };
  if (request?.name?.trim().match(formatNameAndAlias)) {
    next(new ValidationError("Invalid Name"));
    return false;
  }
  if (request?.alias?.trim().match(formatNameAndAlias)) {
    next(new ValidationError("Invalid Alias"));
    return false;
  }
  if (request?.type != type.prod && request?.type != type.preprod) {
    next(new ValidationError("Invaliad Deployment Type"));
    return false;
  }
  return true;
}

async function createDeploymentConnection(deploymentConnectionType) {
  try {
    const saveResponse = await deploymentConnectionType.save();
    return saveResponse;
  } catch (e) {
    return { Error: e };
  }
}

async function createDeploymentConnectionRequest(req) {
  return new deploymentConnection({
    name: getName(req),
    baseurl: getBaseurl(req),
    alias: getAlias(req),
    type: getType(req),
  });
}

async function updatesaveDeploymentConnection(request, next) {
  const updateData = { ...request };
  const updateResponse = await deploymentConnection.findOneAndUpdate(
    { _id: request?._id },
    updateData,
    (error, data) => {
      if (error) {
        next(new ValidationError("Invalid Deployment Connection Name mapping with Id"));
      }
    }
  );
  return updateResponse;
}

function getBaseurl(req) {
  return req?.baseurl.trim();
}

function getName(req) {
  return req?.name.trim().toLowerCase() || "";
}

function getAlias(req) {
  return req?.alias.trim().toLowerCase() || "";
}

function getType(req) {
  return req?.type.trim().toLowerCase() || "";
}

function getDeploymentConnectionId(req) {
  return req?._id;
}
