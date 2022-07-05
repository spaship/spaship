const path = require("path");
const DeployService = require("../../../services/deployService");
const fs = require("fs");
const fsp = require("fs").promises;
const config = require("../../../config");
const common = require("@spaship/common");
const { uuid } = require("uuidv4");
const axios = require("axios");
const zip = require("zip-a-folder").zip;

module.exports = async function envCreation(request) {
  const upload_dir = config.get("upload_dir");
  const deliminator = "../../../";
  const pathClone = path.resolve(__dirname, `${deliminator}${upload_dir}/env-init-${uuid()}`);
  console.log(pathClone);
  const spaArchive = await createSPAshipTemplate(request, pathClone);
  console.log(spaArchive);

  const name = "envInit";
  const env = request.env;
  const propertyName = request.propertyName;
  const namespace = `spaship--${propertyName}`;
  const ref = "0.0.0";
  const appPath = ".";
 
  const response  = await DeployService.deploy({
    name,
    spaArchive,
    appPath,
    ref,
    property: propertyName,
    env,
    namespace,
  });
  console.log(response);
};

async function createSPAshipTemplate(request, pathClone) {
  const _name = "envInit";
  const spaShipFile = {
    websiteVersion: "v1",
    websiteName: request.propertyName,
    name: _name,
    mapping: ".",
    environments: [
      { name: request.env, updateRestriction: false, exclude: false, ns: `spaship--${request.propertyName}` },
    ],
  };
  console.log(`Operator Config : ${spaShipFile.toString()}`);
  await fsp.mkdir(pathClone);
  try {
    let zipPath;
    await fs.writeFileSync(path.join(pathClone, "spaship.txt"), JSON.stringify(spaShipFile, null, "\t"));
    zipPath = await path.join(pathClone, "../SPAship" + uuid() + ".zip");
    console.log(zipPath);
    await zip(pathClone, zipPath);
    return zipPath;
  } catch (err) {
    console.log(err);
    throw new Error("Invalid SPA Path in request body.");
  }
}