const alias = require("../../models/alias");
const { uuid } = require("uuidv4");

module.exports = async function saveAlias(req, res) {
  console.log(req.body);
  if (req.body?.id) {
    const updatedResponse = await updateAlias(req);
    res.send(updatedResponse);
  }
  let id = await getGeneratedAliasId();
  let aliasRequest = await createAliasRequest(id, req);
  const createdResponse = await createEvent(aliasRequest);
  res.send(createdResponse);
};

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

async function createAliasRequest(id, req) {
  const currentTime = getCurrentTime();
  return new alias({
    id: id,
    property: getPropertyName(req),
    env: getEnv(req),
    namespace: getNameSpace(req),
    type: getType(req),
    createdAt: currentTime,
  });
}

async function updateAlias(req) {
  const updateResponse = await alias.findOneAndUpdate({ id: req.body?.id }, updateAliasRequest(req), (error, data) => {
    if (error) {
      console.log("error");
    }
  });
  return updateResponse;
}

async function updateAliasRequest(req) {
  const updateRequest = {
    property: getPropertyName(req),
    env: getEnv(req),
    namespace: getNameSpace(req),
    type: getType(req),
    createdAt: getCurrentTime(),
  };
  return JSON.parse(JSON.stringify(updateRequest));
}

function getCurrentTime() {
  return new Date();
}

function getPropertyName(req) {
  return req.body?.property;
}

function getName(req) {
  return req.body?.name || "";
}

function getEnv(req) {
  return req.body?.env;
}

function getNameSpace(req) {
  return req.body?.namespace;
}

function getType(req) {
  return req.body?.type;
}
