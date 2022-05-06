const alias = require("../../models/alias");
const { uuid } = require("uuidv4");
const ValidationError = require("../../utils/errors/ValidationError");

module.exports = async function saveAlias(req, res, next) {
  console.log(req.body);
  const request = req.body;
  if (!validateProperty(request, next)) return;
  if (request?.id) {
    const updatedResponse = await updateAlias(request);
    return res.send(updatedResponse);
  }
  if (!request.hasOwnProperty("propertyName") || !request.hasOwnProperty("propertyTitle")) {
    return next(new ValidationError("Please provide PropertyName and PropertyTitle"));
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
  const currentTime = getCurrentTime();
  return new alias({
    id: id,
    propertyName: getPropertyName(request),
    propertyTitle: getPropertyTitle(request),
    env: getEnv(request),
    url: getUrl(request),
    namespace: getNameSpace(request),
    type: getType(request),
    createdBy: getCreatedBy(request),
    isActive: true,
    createdAt: currentTime,
    updatedAt: currentTime,
  });
}

async function updateAlias(request) {
  const updateData = { ...request, updatedAt: getCurrentTime() };
  const updateResponse = await alias.findOneAndUpdate({ id: request?.id }, updateData, (error, data) => {
    if (error) {
      console.log("error");
    }
  });
  return updateResponse;
}

function getCurrentTime() {
  return new Date();
}

function getPropertyName(request) {
  return request.propertyName.trim().toLowerCase();
}

function getPropertyTitle(request) {
  return request?.propertyTitle?.trim() || "";
}

function getCreatedBy(request) {
  return request?.createdBy?.trim()?.toLowerCase() || "";
}

function getEnv(request) {
  return request.env.trim().toLowerCase();
}

function getNameSpace(request) {
  return request?.namespace?.trim()?.toLowerCase() || "";
}

function getType(request) {
  return request?.type?.trim()?.toLowerCase() || "operator";
}

function getUrl(request) {
  return request?.url?.trim()?.toLowerCase() || "";
}
