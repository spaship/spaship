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
const activityStream = require("../models/activityStream");
const _ = require("lodash");
const APIKey = require("../models/apiKey");
const ephemeralRecord = require("../models/ephemeralRecord");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const config = require("../config");
const { hash } = require("../utils/cryptoUtil");
const ValidationError = require("../utils/errors/ValidationError");
const saveActivity = require("./operatorServices/operations/saveActivity");
const ephemeralEnvCreation = require("./operatorServices/operations/ephemeralEnvCreation");
const ephemeralEnvDeletion = require("./operatorServices/operations/ephemeralEnvDeletion");

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
  const userId = await extractUserId(req);
  const name = getNameRequest(req);
  const identifier = getIdentifier(name);
  const nextRef = getRefRequest(req);
  const ref = "";
  const { path: appPath } = getRequestBody(req);
  const { path: spaArchive } = getPath(req);
  const propertyName = getPropertyName(req);
  const namespace = generateNamespace(propertyName);
  let env = req.params?.env;
  let ephemeralResponse;
  if (getEphemeral(req) == true) {
    console.log("This deployment is ephemeral enabled");
    const actionId = req?.body?.actionId || 'NA';
    const findEphemeral = await ephemeralRecord.findOne({ propertyName, actionId, actionEnabled: true, isActive: true });
    try {
      if (findEphemeral?.env) {
        console.log(`Active env present for the action is ${actionId}`);
        if (!findEphemeral.env.includes('ephemeral')) {
          throw new ValidationError("Issue whille createing the env");
        }
        env = findEphemeral.env;
      }
      else {
        console.log(`Creating new env present for the action is ${actionId}`);
        ephemeralResponse = await ephemeralEnvCreation({ propertyName, namespace, userId, actionId });
        if (!ephemeralResponse.env.includes('ephemeral')) {
          throw new ValidationError("Issue whille createing the env")
        }
        env = ephemeralResponse.env;
      }
    }
    catch (e) {
      next(new ValidationError(e));
      return;
    }

  }
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
        name: identifier,
        spaArchive,
        appPath,
        ref,
        property: propertyName,
        env,
        namespace,
      });

      if (response) {
        const application = await Application.findOne({ propertyName, identifier, path: appPath, env });
        try {
          if (application) {
            await Application.updateOne({ propertyName, identifier, path: appPath, env }, { name, nextRef });
          } else {
            await Application.create({
              propertyName,
              name: name,
              identifier,
              path: appPath,
              ref: "",
              nextRef,
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
      if (getEphemeral(req) == true) {
        await ephemeralEnvDeletion({ propertyName, env, createdBy: userId });
      }

      res.status(201).send({
        name,
        path: appPath,
        ref: nextRef,
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
  const { propertyName } = req.params;
  try {
    const result = await Application.findOne({ propertyName });
    const toObject = true;
    const application = await Application.findOne({ propertyName: propertyName }).remove().exec();;
    if (application) {
      res.status(200).json({ message: "Application removed successfully." });
    } else {
      next(new NotFoundError(`Application named ${propertyName} not found.`));
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
  const env = getEnvs(request);
  const userId = getUserId(req);
  const token = jwt.sign(
    { expiresIn: expiration, propertyName: propertyName, env: env, createdBy: userId, createdAt: new Date() },
    secret,
    {
      expiresIn: expiration,
    }
  );
  const label = getLabel(request);
  const expiredDate = formatDate(expiration);
  const key = uuid() + token.substring(0, 4);
  const shortKey = key.substring(0, 7);
  const hashKey = hash(key);
  const data = {
    label,
    propertyName,
    shortKey,
    hashKey,
    key,
    token,
    userId,
    env,
    expiredDate,
  };
  const apikey = await APIKey.create(data);
  const _payload = JSON.stringify(data);

  const _createApikey = "CREATE_APIKEY"
  const activity = new activityStream({
    source: userId,
    action: _createApikey,
    propertyName: propertyName,
    props: { env: env.toString(), spaName: "NA" },
    payload: _payload,
  });
  await saveActivity(activity)

  return res.status(200).json({ propertyName: apikey.propertyName, token: apikey.key });
};

function getLabel(request) {
  return request.label || "default";
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

function getEphemeral(req) {
  if (req?.body?.ephemeral == 'true') {
    return true;
  }
  return false;
}

async function extractUserId(req) {
  const key = req.headers.authorization.split(' ')[1];
  const response = await APIKey.findOne({ key: key });
  return response?.userId || 'NA';
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
  if (!request.hasOwnProperty("propertyName") || !request.hasOwnProperty("env")) {
    next(new ValidationError("Missing properties in request body"));
    return false;
  }
  if (request?.propertyName?.trim().match(formatPropertyName)) {
    next(new ValidationError("Invalid PropertyName"));
    return false;
  }
  if (request?.env.length == 0) {
    next(new ValidationError("Please provide the environment"));
    return false;
  }
  return true;
}


function getIdentifier(req) {
  return encodeURIComponent(req)
    .toLowerCase()
    /* Replace the encoded hexadecimal code with `-` */
    .replace(/%[0-9a-zA-Z]{2}/g, '-')
    /* Replace any special characters with `-` */
    .replace(/[\ \-\/\:\@\[\]\`\{\~\.]+/g, '-')
    /* Special characters are replaced by an underscore */
    .replace(/[\|!@#$%^&*;"<>\(\)\+,]/g, '_')
    /* Remove any starting or ending `-` */
    .replace(/^-+|-+$/g, '')
    /* Removing multiple consecutive `-`s */
    .replace(/--+/g, '-');
}