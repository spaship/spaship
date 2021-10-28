const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const config = require("../../config");
const { log } = require("@spaship/common/lib/logging/pino");

function getFile(req) {
  return req.sanitize(req?.file?.filename) || [];
}

function getDescription(req) {
  return req.sanitize(req?.body?.description) || "";
}

function getWebsite(req) {
  return req.sanitize(req?.body?.website) || "";
}

const uploadSpaController = async (req, res) => {
  const uploadBasePath = path.resolve(__dirname, `../${config.get("cli:dir_path")}`);

  const formData = new FormData();
  formData.append("website", getWebsite(req));
  formData.append("description", getDescription(req));
  formData.append("zipfile", fs.createReadStream(`${uploadBasePath}/${getFile(req)}`));

  const options = {
    method: "POST",
    url: config.get("cli:base_path"),
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  try {
    const response = await axios(options);
    res.send(response.config);
  } catch (err) {
    log.error(err);
  }
};


module.exports = { uploadSpaController };