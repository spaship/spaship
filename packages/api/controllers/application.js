const { log } = require("@spaship/common/lib/logging/pino");
const common = require("@spaship/common");
const FileService = require("../services/fileService");
const DeployService = require("../services/deployService");
const Application = require("../models/application");
const DeployError = require("../utils/errors/DeployError");
const NotFoundError = require("../utils/errors/NotFoundError");
const NotImplementedError = require("../utils/errors/NotImplementedError");
const { getUserUUID } = require("../utils/requestUtil");

module.exports.list = async (req, res, next) => {
  const list = await FileService.getAll();
  res.send(list);
};

module.exports.get = async (req, res, next) => {
  const userId = getUserUUID(req);
  const { name } = getName(req);
  try {
    const application = await FileService.find(name);
    if (application) {
      return res.send(application);
    }
    next(new NotFoundError("Could not find the application you requested."));
  } catch (error) {
    next(error);
  }
};

module.exports.post = async (req, res, next) => {
  const userId = getUserUUID(req);
  const { name, path } = getRequestBody(req);
  const data = {
    name,
    path,
    userId,
  };
  try {
    const app = await Application.create(data);
    res.status(201).send({
      name,
      path,
      timestamp: app.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.put = async (req, res, next) => {
  const userId = getUserUUID(req);
  const { name } = req.params;
  next(new NotImplementedError());
};

module.exports.deploy = async (req, res, next) => {
  const userId = getUserUUID(req);
  const { name, path: appPath, ref } = getRequestBody(req);
  const { path: spaArchive } = getPath(req);

  try {
    await DeployService.deploy({
      name,
      spaArchive,
      appPath,
      ref,
    });

    const application = await Application.findOne({ name, path: appPath });
    if (application) {
      await Application.updateOne({ name, path: appPath }, { ref });
    } else {
      await Application.create({ name, path: appPath, ref, userId });
    }
    res.status(201).send({
      name,
      path: appPath,
      ref,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error(`Failed to deploy "${name}" to ${appPath}: ${err}`);
    next(new DeployError(err));
  }
};

module.exports.delete = async (req, res, next) => {
  const userId = getUserUUID(req);
  const { name } = req.params;
  try {
    const result = await Application.findOne({ name, userId });
    const application = await Application.findOneAndDelete({ name, userId });
    if (application) {
      const path = application.path;
      await FileService.remove(path);
      res.status(200).json({ message: "Application removed successfully." });
    } else {
      next(new NotFoundError(`Application named ${name} not found.`));
    }
  } catch (error) {
    next(error);
  }
};
function getName(req) {
  const requestParams = req.sanitize(req?.params) || {}
  return requestParams;
}

function getRequestBody(req) {
  const requestBody = req.sanitize(req?.body) || {}
  return requestBody;
}

function getPath(req) {
  const requestFile = req.sanitize(req?.file) || {}
  return requestFile;
}
