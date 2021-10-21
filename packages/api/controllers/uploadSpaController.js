const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const config = require("../config");

const uploadSpaController = async (req, res) => {
  console.log(req.file);
  const uploadBasePath = path.resolve(__dirname, `../${config.get("cli:dir_path")}`);
  console.log(uploadBasePath);

  const formData = new FormData();
  formData.append("website", getWebsite(req));
  formData.append("description", getDescription(req));
  formData.append("zipfile", fs.createReadStream(`${uploadBasePath}/${getFile(req)}`));

  let options = {
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
    console.log("Error", err);
  }
};

function getFile(req) {
  return req.sanitize(req?.file?.filename) || [];
}

function getDescription(req) {
  return req.sanitize(req?.body?.description) || "";
}

function getWebsite(req) {
  return req.sanitize(req?.body?.website) || "";
}

module.exports = { uploadSpaController };