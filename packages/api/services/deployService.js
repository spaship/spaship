const fsp = require("fs").promises;
const fs = require("fs");
const path = require("path");
const mvdir = require("mvdir");
const common = require("@spaship/common");
const decompress = require("decompress");
const config = require("../config");
const fileService = require("./fileService");
const alias = require("../models/alias");
const os = require("os");
const archiver = require("archiver");
const cliActivities = require("../models/cliActivities");
const { uuid } = require("uuidv4");
const FormData = require("form-data");
const axios = require("axios");
const zip = require("zip-a-folder").zip;
/**
 * detect if the archive was created with `npm pack`.  npm pack creates a
 * tarball with a "package" dir.  we want what's in the package dir but not
 * the dir itself.
 * @param {*} dir
 */
const isNPMPack = async (dir) => {
  try {
    const packageStat = await fsp.lstat(path.join(dir, "package"));
    return packageStat.isDirectory();
  } catch (e) {
    console.warn("Package directory not found");
  }
  return false;
};

async function deploy({ name, spaArchive, appPath, ref, property, env } = {}) {
  // create a dir in the tmp_dir location, but keep the random archive name
  let tmpDir = `${spaArchive}-extracted`;
  await fsp.mkdir(tmpDir);
  console.log("Deployment Started  : ");
  console.log(tmpDir);
  // extract the archive
  await decompress(spaArchive, tmpDir);
  // if the archive was generated by `npm pack`, move into the "package"
  // directory where all the goodies are.
  const shouldRepath = await isNPMPack(tmpDir);
  if (shouldRepath) {
    tmpDir = path.join(tmpDir, "package");
  }

  //to check operator
  console.log("Checking the property is Operator or Baremetal : ");
  const responseAlias = await alias.find({ propertyName: property, env: env });
  if (responseAlias?.length > 0) {
    const operatorAlias = responseAlias[0]._doc;
    console.log(operatorAlias);
    if (operatorAlias?.type === "operator") {
      const zipPath = await createSPAshipTemplateRequest(operatorAlias, name, appPath, tmpDir, env);

      const formData = new FormData();
      try {
        const fileStream = await fs.createReadStream(zipPath);
        formData.append("spa", fileStream);
        formData.append("description", property);
      } catch (err) {
        console.log(err);
        return;
      }
      formData.append("website", property);

      try {
        const response = await axios.post(config.get("cli:base_path"), formData, {
          maxBodyLength: Infinity,
          headers: formData.getHeaders(),
        });
        console.log(response?.data);
        return;
      } catch (err) {
        console.log(err);
        next(err);
        return;
      }
    }
  }

  let spaConfig = { name, path: appPath };
  let hasYaml = false;
  const yamlFilePath = path.join(tmpDir, "spaship.yaml");
  try {
    spaConfig = await common.config.read(yamlFilePath);
    hasYaml = true;
  } catch (e) {
    console.warn("SPAship yaml config not found");
  }

  const validation = common.config.validate(spaConfig);

  if (!validation.valid) {
    throw new Error(`spaship.yaml is not valid: ${JSON.stringify(validation.errors)}`);
  }

  // remove starting slashes in paths
  const flatPath = common.flatpath.toDir(spaConfig.path);
  const destDir = path.join(config.get("webroot"), flatPath);

  // write spa metadata to filesystem
  if (!hasYaml) {
    await fileService.write(yamlFilePath, { name, path: spaConfig.path });
  }
  if (ref) {
    await fileService.write(yamlFilePath, { ref });
  }

  try {
    const htaccessPath = path.join(tmpDir, ".htaccess");
    if (!fs.existsSync(htaccessPath)) {
      await common.htaccess.write(tmpDir, spaConfig);
    } else {
      console.info("SPA included an .htaccess file, we will not write one");
    }
  } catch (error) {
    console.error("There was an error writing .htaccess file.", error);
  }

  if (fs.existsSync(destDir)) {
    await fsp.rmdir(destDir, { recursive: true });
  }

  await mvdir(tmpDir, destDir);
}

module.exports = { deploy };

async function createSPAshipTemplateRequest(operatorAlias, name, appPath, tmpDir, env) {
  if (appPath.charAt(0) == "/" && appPath.length === 1) appPath = ".";
  else if (appPath.charAt(0) == "/") appPath = appPath.substr(1);
  const spaShipFile = {
    websiteVersion: "v1",
    websiteName: operatorAlias.propertyName,
    name: name,
    mapping: appPath,
    environments: [{ name: env, updateRestriction: false, exclude: false }],
  };
  console.log("Operator Config : ");
  console.log(spaShipFile);
  try {
    let zipPath;
    if (await fileExists(path.join(tmpDir, "dist"))) {
      await fs.writeFileSync(path.join(tmpDir, "dist/.spaship"), JSON.stringify(spaShipFile, null, "\t"));
      zipPath = path.join(tmpDir, "../SPAship" + uuid() + ".zip");
      await zip(path.join(tmpDir, "dist"), zipPath);
    } else if (await fileExists(path.join(tmpDir, "build"))) {
      await fs.writeFileSync(path.join(tmpDir, "build/.spaship"), JSON.stringify(spaShipFile, null, "\t"));
      zipPath = path.join(tmpDir, "../SPAship" + uuid() + ".zip");
      await zip(path.join(tmpDir, "build"), zipPath);
    } else {
      await fs.writeFileSync(path.join(tmpDir, ".spaship"), JSON.stringify(spaShipFile, null, "\t"));
      zipPath = path.join(tmpDir, "../SPAship" + uuid() + ".zip");
      await zip(tmpDir, zipPath);
    }
    return zipPath;
  } catch (err) {
    console.log(err);
    throw new Error("Invalid SPA Path in request body.");
  }
}

const delay = (millis) =>
  new Promise((resolve, reject) => {
    setTimeout((_) => resolve(), millis);
  });

const fileExists = async (path) => !!(await fs.promises.stat(path).catch((e) => false));
