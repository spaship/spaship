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
const alias = require("../models/alias");
const _ = require("lodash");
const APIKey = require("../models/apiKey");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const config = require("../config");
const { hash } = require("../utils/cryptoUtil");

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
  if (getWebPropertyName(req)) {
    const uploadBasePath = path.resolve(__dirname, `../${config.get("upload_dir")}`);
    const formData = new FormData();
    log.info(req);
    try {
      const fileStream = await fs.createReadStream(`${uploadBasePath}/${getFile(req)}`);
      formData.append("spa", fileStream);
      formData.append("description", getDescription(req));
    } catch (err) {
      log.error(err);
      next(err);
      return;
    }
    formData.append("website", getWebPropertyName(req));

    try {
      const response = await axios.post(config.get("cli:base_path"), formData, {
        maxBodyLength: Infinity,
        headers: formData.getHeaders(),
      });
      const currentTime = new Date();
      const cliActivitiesRequest = new cliActivities({
        id: uuid(),
        fileName: req?.file?.filename,
        webProperty: getWebPropertyName(req),
        description: getDescription(req),
        isActive: true,
        createdAt: currentTime,
        updatedAt: currentTime,
      });
      const cliActivitiesResponse = await cliActivitiesRequest.save();
      res.send({
        status: "SPA deployment process started into operator.",
        message: response.data,
        cliData: cliActivitiesResponse,
      });
      return;
    } catch (err) {
      log.error(err);
      next(err);
      return;
    }
  }
  const userId = getUserUUID(req);
  const name = getNameRequest(req);
  const ref = getRefRequest(req);
  const { path: appPath } = getRequestBody(req);
  const { path: spaArchive } = getPath(req);
  const property = req.params.propertyName;
  const env = req.params.env;
  const validateFileType = req.file.originalname.split(".").pop();
  if (validateFileType === "zip" || validateFileType === "tgz") {
    try {
      await DeployService.deploy({
        name,
        spaArchive,
        appPath,
        ref,
        property,
        env,
      });

      const application = await Application.findOne({ name, path: appPath });
      try {
        if (application) {
          await Application.updateOne({ name: name, path: appPath }, { ref });
        } else {
          await Application.create({ name: name, path: appPath, ref, userId });
        }
      } catch (e) {
        console.log(e);
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
  } else {
    next(new DeployError("Invalid File Type"));
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
  const expiration = req.body?.expiresIn || config.get("token:expiration");
  const secret = config.get("token:secret");
  const token = jwt.sign({ createdAt: new Date(), expiresIn: expiration }, secret, {
    expiresIn: expiration,
  });
  let result = null;

  if (req.body?.label == "spaship-cli-token") {
    const label = req.body?.label;
    const expiredDate = formatDate(new Date(), 1, 2);
    const key = token;
    const userId = uuid() + key.substring(0, 4);
    const shortKey = hash(userId);
    const hashKey = token;
    const data = {
      label,
      shortKey,
      hashKey,
      userId,
      expiredDate,
    };
    result = await APIKey.create(data);
    return res.status(200).json({ message: "Validation is successful.", token: result?.userId });
  }

  res.status(200).json({ message: "Validation is successful.", token: token });
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
  if (req?.body?.ref == "undefined") return req.params.env;
  const requestBody = req?.body?.ref;
  return requestBody;
}

function getPath(req) {
  const requestFile = req?.file || {};
  return requestFile;
}

function getFile(req) {
  if (req?.file?.filename) {
    const processedFile = req.file.originalname.split(".");
    if (processedFile[processedFile.length - 1] != "zip") {
      throw new Error("Uploaded file format is invalid (Expected format : zip).");
    }
    return req?.file?.filename;
  }
  throw new Error("File missing in the request body !");
}

function getDescription(req) {
  if (req?.body?.description && req?.body?.description.trim().length > 0) return req?.body?.description.trim();
  throw new Error("Description missing in the request body !");
}

function getWebPropertyName(req) {

  return req?.body?.webPropertyName || false;
}

function formatDate(date, month, days) {
  var d = new Date(date),
    month = "" + (d.getMonth() + month),
    day = "" + (d.getDate() + days),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
