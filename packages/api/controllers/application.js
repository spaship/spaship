const { log } = require("@spaship/common/lib/logging/pino");
const fileService = require("../services/fileService");
const Application = require("../models/application");
const DeployError = require("../utils/errors/DeployError");
const { getUserUUID } = require("../utils/requestUtil");

module.exports.list = async (req, res, next) => {
  const list = await fileService.getAll();
  res.send(list);
};

module.exports.get = async (req, res) => {
  const userId = getUserUUID(req);
  const { name } = req.param;
  const application = Application.findOne({ name, userId });
  res.send(application);
};

module.exports.post = async (req, res) => {
  const userId = getUserUUID(req);
  const { name, path, ref } = req.body;
  const data = {
    name,
    path,
    ref,
    userId,
  };
  const app = await Application.create(data);
  res.send(app);
};

module.exports.put = async (req, res) => {
  res.send();
};

module.exports.deploy = async (req, res) => {
  const userId = getUserUUID(req);
  const { name, path: appPath, ref } = req.body;
  const { path: spaArchive } = req.file;

  try {
    await deploy({ name, spaArchive, appPath, ref });
    await Application.create({ name, path, ref, userId });
    log.info(`deployed "${name}" to ${appPath}`);
    res.status(201).send("SPA deployed successfully.");
  } catch (error) {
    log.error(`failed to deploy "${name}" to ${appPath}: ${err}`);
    throw new DeployError(err);
  }
};

module.exports.delete = async (req, res) => {
  const userId = getUserUUID(req);
  const { name } = req.param;
  const application = await Application.findOne({ name, userId });
  const path = application.get("path");
  await Application.deleteOne({ name, userId });
  await fileService.remove(path);
  res.send("remove successfully");
};
