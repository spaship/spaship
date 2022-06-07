const alias = require("../../../models/alias");
const { uuid } = require("uuidv4");
const ValidationError = require("../../../utils/errors/ValidationError");

module.exports = async function saveAlias(req, res, next) {
  console.log(req.body);
  const request = req.body;
  if (checkProperties(request)) {
    return next(new ValidationError("Missing properties in request body"));
  }
  if (!validateProperty(request, next)) return;
  if (!validateDeploymentConnectionType(request, next)) return;
  if (request?.id) {
    const updatedResponse = await updateAlias(request);
    return res.send(updatedResponse);
  }
  const result = await alias.findOne({ propertyName: getPropertyName(request), env: getEnv(request) });
  if (result) {
    return next(new ValidationError("Propertyname & Env exists."));
  }
  let id = await getGeneratedAliasId();
  let aliasRequest = await createAliasRequest(id, request);
  const createdResponse = await createEvent(aliasRequest);
  res.send(createdResponse);
};

function checkProperties(request) {
  return (
    !request.hasOwnProperty("propertyName") ||
    !request.hasOwnProperty("propertyTitle") ||
    !request.hasOwnProperty("env") ||
    !request.hasOwnProperty("url") ||
    !request.hasOwnProperty("deploymentConenctionType")
  );
}

function validateProperty(request, next) {
  const formatPropertyName = /[ `!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~]/;
  const formatEnv = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  const formatUrl = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/;
  if (request?.propertyName?.trim().match(formatPropertyName)) {
    next(new ValidationError("Invalid PropertyName"));
    return false;
  }
  if (request?.env?.trim().match(formatEnv)) {
    next(new ValidationError("Invalid Env"));
    return false;
  }
  if (request?.url?.trim().match(formatUrl)) {
    next(new ValidationError("Invalid Url"));
    return false;
  }
  if (request.hasOwnProperty("type")) {
    const type = request?.type?.trim()?.toLowerCase();
    if (type != "operator" && type != "baremetal") {
      next(new ValidationError("Property Type must be operator or baremetal"));
      return false;
    }
  }
  return true;
}

function validateDeploymentConnectionType(request, next) {
  const type = { prod: "prod", preprod: "preprod" };
  if (request?.deploymentConenctionType == type.prod || request?.deploymentConenctionType == type.preprod) {
    return true;
  }
  next(new ValidationError("Invalid Deployment Conenction Type"));
  return false;
}

async function createEvent(aliasRequest) {
  try {
    const saveResponse = await aliasRequest.save();
    return saveResponse;
  } catch (e) {
    return { Error: e };
  }
}

async function getGeneratedAliasId() {
  return uuid();
}

async function createAliasRequest(id, request) {
  return new alias({
    id: id,
    propertyName: getPropertyName(request),
    propertyTitle: getPropertyTitle(request),
    env: getEnv(request),
    url: getUrl(request),
    namespace: generateNamespace(getPropertyName(request)),
    deploymentConenctionType: getDeploymentConenctionType(request),
    type: getType(request),
    createdBy: getCreatedBy(request),
  });
}

async function updateAlias(request) {
  const updateData = { ...request };
  const updateResponse = await alias.findOneAndUpdate({ id: request?.id }, updateData, (error, data) => {
    if (error) {
      console.log("error");
    }
  });
  return updateResponse;
}

function getPropertyName(request) {
  return request.propertyName.trim().toLowerCase();
}

function getPropertyTitle(request) {
  return request?.propertyTitle?.trim() || "";
}

function getDeploymentConenctionType(request) {
  return request?.deploymentConenctionType?.trim() || "";
}

function getCreatedBy(request) {
  return request?.createdBy?.trim()?.toLowerCase() || "";
}

function getEnv(request) {
  return request.env.trim().toLowerCase();
}

function generateNamespace(propertyName) {
  return `spaship--${propertyName}`;
}

function getType(request) {
  return request?.type?.trim()?.toLowerCase() || "operator";
}

function getUrl(request) {
  return request?.url?.trim()?.toLowerCase() || "";
}
