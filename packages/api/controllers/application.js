const { log } = require("@spaship/common/lib/logging/pino");
const common = require("@spaship/common");
const FileService = require("../services/fileService");
const DeployService = require("../services/deployService");
const Application = require("../models/application");
const DeployError = require("../utils/errors/DeployError");
const NotFoundError = require("../utils/errors/NotFoundError");
const NotImplementedError = require("../utils/errors/NotImplementedError");
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
const ValidationError = require("../utils/errors/ValidationError");

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
  if (!validatePropertyName(req, next)) return;
  const userId = getUserUUID(req);
  const name = getNameRequest(req);
  const ref = getRefRequest(req);
  const { path: appPath } = getRequestBody(req);
  const { path: spaArchive } = getPath(req);
  const propertyName = getPropertyName(req);
  const namespace = generateNamespace(propertyName);
  const env = req.params?.env;
  const accessUrl = "";
  const validateFileType = req.file.originalname.split(".").pop();
  if (
    validateFileType === "zip" ||
    validateFileType === "tgz" ||
    validateFileType === "gz" ||
    validateFileType === "bz2"
  ) {
    try {
      const response = await DeployService.deploy({
        name,
        spaArchive,
        appPath,
        ref,
        property: propertyName,
        env,
        namespace,
      });

      if (response) {
        const application = await Application.findOne({ propertyName, name, path: appPath, env });
        try {
          if (application) {
            await Application.updateOne({ propertyName, name, path: appPath, env }, { ref });
          } else {
            await Application.create({
              propertyName,
              name: name,
              path: appPath,
              ref,
              userId,
              env,
              namespace,
              accessUrl,
            });
          }
        } catch (e) {
          console.log(e);
        }
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
  const request = req.body;
  if (!validateProperties(request, next)) return;
  const expiration = request?.expiresIn || config.get("token:expiration");
  const secret = config.get("token:secret");
  const propertyName = request.propertyName;
  const envs = getEnvs(request);
  const response = [];
  for (let env of envs) {
    const token = jwt.sign(
      { createdAt: new Date(), expiresIn: expiration, propertyName: propertyName, env: env },
      secret,
      {
        expiresIn: expiration,
      }
    );
    const label = getLabel(request);
    const expiredDate = formatDate(expiration);
    const userId = getUserId(req);
    const key = uuid() + token.substring(0, 4);
    const shortKey = key.substring(0, 7);
    const hashKey = hash(key);
    const data = {
      label,
      propertyName,
      env,
      shortKey,
      hashKey,
      key,
      token,
      userId,
      expiredDate,
    };
    const apikey = await APIKey.create(data);
    response.push({ propertyName: apikey.propertyName, env: apikey.env, token: apikey.key });
  }
  return res.status(200).json(response);
};

function getLabel(request) {
  return request.label || "NA";
}

function getUserId(req) {
  return req.body?.createdBy || "";
}

function getEnvs(req) {
  return req?.env;
}

function generateNamespace(propertyName) {
  return `spaship--${propertyName}`;
}

function getPropertyName(req) {
  return req.params?.propertyName;
}

function validatePropertyName(req, next) {
  const proeprtyName = req.params?.propertyName;
  const formatPropertyName = /[ `!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~]/;
  if (proeprtyName?.trim().match(formatPropertyName)) {
    next(new ValidationError("Invalid PropertyName"));
    return false;
  }
  return true;
}

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
  if (req?.body?.ref == "undefined") return "Ready to deploy";
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

function formatDate(expiration) {
  const expiresIn = new Date();
  expiresIn.setDate(expiresIn.getDate() + parseInt(expiration));
  return expiresIn;
}

function validateProperties(request, next) {
  const formatPropertyName = /[ `!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~]/;
  const formatEnv = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (!request.hasOwnProperty("propertyName") || !request.hasOwnProperty("env")) {
    next(new ValidationError("Missing properties in request body"));
    return false;
  }

  if (request?.propertyName?.trim().match(formatPropertyName)) {
    next(new ValidationError("Invalid PropertyName"));
    return false;
  }
  if (request?.env.length < 1) {
    next(new ValidationError("Please provide the environment"));
    return false;
  }
  const envs = request.env;
  for (let env of envs) {
    if (env?.trim().match(formatEnv)) {
      next(new ValidationError("Invalid environment"));
      return false;
    }
  }
  return true;
}
