const { log } = require("@spaship/common/lib/logging/pino");
const common = require("@spaship/common");
const FileService = require("../services/fileService");
const DeployService = require("../services/deployService");
const Application = require("../models/application");
const DeployError = require("../utils/errors/DeployError");
const NotFoundError = require("../utils/errors/NotFoundError");
const NotImplementedError = require("../utils/errors/NotImplementedError");
const cliActivities = require("../models/cliActivities");
const { getUserUUID } = require("../utils/requestUtil");
const { uuid } = require("uuidv4");
const jwt = require("jsonwebtoken");

const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const config = require("../config");

module.exports.list = async (req, res, next) => {
  const list = await FileService.getAll();
  res.send(list);
};

module.exports.get = async (req, res, next) => {
  const userId = getUserUUID(req);
  const name = getName(req);
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
  const name = getNameRequest(req);
  const path = getPathRequest(req);
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
  const name = getName(req);
  next(new NotImplementedError());
};

module.exports.deploy = async (req, res, next) => {
  try {
    if (getWebPropertyName(req)) {
      const uploadBasePath = path.resolve(__dirname, `../${config.get("upload_dir")}`);
      const formData = new FormData();
      try {
        const fileStream = await fs.createReadStream(`${uploadBasePath}/${getFile(req)}`);
        formData.append("spa", fileStream);
        formData.append("description", getDescription(req));
      } catch (err) {
        log.error(err);
        res.status(400).send(err);
        return;
      }
      formData.append("website", getWebPropertyName(req));

      try {
        const response = await axios.post(config.get("cli:base_path"), formData, {
          headers: formData.getHeaders(),
        });
        res.send({ status: "SPA deployement process started into operator.", message: response.data });
        return;
      } catch (err) {
        log.error(err);
        res.send(err);
        return;
      }
    }
  } catch (err) {
    log.error(err);
  }

  const userId = getUserUUID(req);
  const name = getNameRequest(req);
  const ref = getRefRequest(req);
  const { path: appPath } = getRequestBody(req);
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

module.exports.validate = async (req, res, next) => {
  res.status(200).json({ message: "Request is authenticated" });
};

function getName(req) {
  const requestParams = req?.params?.name || {};
  return requestParams;
}

function getRequestBody(req) {
  const requestBody = req?.body || {};
  return requestBody;
}

function getNameRequest(req) {
  const requestName = req?.body?.name || "";
  return requestName;
}

function getPathRequest(req) {
  const requestPath = req?.body?.path || "";
  return requestPath;
}

function getRefRequest(req) {
  const requestBody = req?.body?.ref || {};
  return requestBody;
}

function getPath(req) {
  const requestFile = req?.file || {};
  return requestFile;
}

function getFile(req) {
  if (req?.file?.filename) return req?.file?.filename;
  throw new Error("File missing in the request body !");
}

function getDescription(req) {
  if (req?.body?.description) return req?.body?.description;
  throw new Error("Description missing in the request body !");
}

function getWebPropertyName(req) {
  return req?.body?.webPropertyName;
}
