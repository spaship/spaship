const URL = require("url").URL;
const { Command, flags } = require("@oclif/command");
const common = require("@spaship/common");
const { assign, get } = require("lodash");
const fs = require("fs");
const FormData = require("form-data");
const ora = require("ora");
const { performance } = require("perf_hooks");
const prettyBytes = require("pretty-bytes");
const DeployService = require("../services/deployService");
const commonFlags = require("../common/flags");
const { loadRcFile } = require("../common/spashiprc-loader");
const { zipDirectory } = require("../common/zip");
const nodePath = require("path");

function isURL(s) {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
}

// regex to test whether an environment name is valid
const validEnvName = /^[A-Za-z_]+[A-Za-z_0-9]+$/;
const validPRId = /[ `!@#$%^&*()_+\=\[\]{};':"\\|,<>\/?~]/;

class DeployCommand extends Command {
  async run() {
    const { args, flags } = this.parse(DeployCommand);

    const config = loadRcFile();
    const file = flags?.file;
    let yamlConfig;
    try{
      if(file){
        yamlConfig= await common.config.read(file);
      }else{
        yamlConfig= await common.config.read("spaship.yaml");
      }
    } catch(e) {
      this.error("Please run spaship init to generate spaship.yaml.");
    }
    const yamlPath = yamlConfig && yamlConfig.path;
    // We need send `name` and `path` to API
    // so read them from spaship.yaml or other config file
    // it could be store in package.json
    const name = yamlConfig ? yamlConfig.name : config.name;
    let path = flags.path || yamlPath;
    const configBuildDir = yamlConfig ? (yamlConfig.buildDir || yamlConfig.builddir) : (config.buildDir || config.builddir); // buildDIr from config
    const buildDir = (flags.builddir || flags.buildDir) ? (flags.builddir || flags.buildDir) : configBuildDir; // uses command line arg if present
    const ephemeral = flags?.preview || false;
    const actionId = flags?.prid;
    const duration = flags?.duration;
    const image = flags?.image || false;

    if (image) {
      this.log("It is a containerized deployment [SSR], please update the corresponding application from the SPAship Manager section. \nNote : To know more about it please check the https://spaship.redhat.com/documents.");
    }
    else {
      if (actionId && !ephemeral) {
        this.error("You need to provide --preview or -P to use this --prid option [example : --preview --prid=10 or -P --prid=10]");
      }

      if (ephemeral) {
        this.log("This Deployment is ephemeral preview enabled, please check your deployment from SPAship Manager")
      }
    }




    if (!name) {
      this.error("Please define your app name in your package.json or use init to create spaship.yaml ");
    }
    if (!path) {
      this.error("Please define your app path in your package.json or use init to create spaship.yaml ");
    }
    if (!path.startsWith("/")) {
      path = "/" + path;
    }

    // if --env is a properly formatted URL, use it as the SPAship host, otherwise treat is as the name of a SPAship
    // environment.
    const envIsURL = isURL(flags.env);
    let host;
    const apiPath = "/api/v1/applications/deploy";

    // if a url was passed in to --env, use it, otherwise treat it as a name and look up that env's url
    if (envIsURL) {
      host = flags.env;
    } else {
      if (!validEnvName.test(flags.env)) {
        this.error(
          `The requested environment, "${flags.env}", is invalid.  Environment names must consist of letters, numbers, and underscores, and must not begin with a number.`
        );
      }
      host = get(config, `envs.${flags.env}.url`);
    }

    if (!host) {
      this.error(`The requested environment, "${flags.env}", is not defined in your spashiprc file.`);
    }

    try {
      if (host.endsWith("/api/v1")) { host = `${host}/applications/deploy` }
      else if (!host.includes(apiPath)) { host = `${host}${apiPath}` }
      host = new URL(host);
    } catch (error) {
      this.error(`The API url ${host} is invalid`);
    }

    // look for the API key first in the --apikey option, and next in the spashiprc file.
    let apikey;
    let rc_apikey = get(config, `envs.${flags.env}.apikey`);
    if (flags.apikey) {
      apikey = flags.apikey;
    } else if (!envIsURL && rc_apikey) {
      apikey = rc_apikey;
    }

    if (!apikey) {
      this.error(`An API key must be provided, either in your spashiprc file or in a --apikey option.`);
    }

    if (!image) {
      if (!args.archive) {
        if (buildDir) {
          // No archive path specified in the commandline as argument and buildDir is specified in the spaship.yaml
          const buildDirPath = nodePath.join(process.cwd(), buildDir);
          try {
            fs.statSync(buildDirPath);
          } catch {
            this.error(`Unable to access ${buildDirPath}, please check the buildDir value.`);
          }
          let rawSpashipYml;
          if(file) rawSpashipYml= await common.config.readRaw(file);
          else  rawSpashipYml= await common.config.readRaw("spaship.yaml");     
          this.log("Creating a zip archive...");
          try {
            args.archive = await zipDirectory(buildDirPath, rawSpashipYml);
            this.log(buildDirPath);
            this.log(rawSpashipYml);
            this.log("Done creating the archive...");
          } catch (e) {
            this.error(e);
          }
        } else {
          // No buildDir is specified in the spaship.yaml
          this.error("You should provide the archive file name which contains the spaship.yaml file.");
        }
      }
    }

    const spinner = ora(`Start deploying SPA`);
    this.log(`Deploying SPA to ${flags.env}${envIsURL ? "" : ` (${host})`}`);
    let step = "uploading";
    try {
      spinner.start();
      const startTime = performance.now();
      let processTime;

      const data = new FormData();
      data.append("name", name);
      data.append("path", path);
      data.append("ref", this.getRef(flags));
      if (image) {
        data.append("imageUrl", image);
      }
      else {
        if (ephemeral) {
          data.append("ephemeral", 'true');
          if (actionId) {
            data.append("actionId", actionId);
          }
          if (duration) {
            data.append("expiresIn", duration);
          }
        }
      }

      if (!image) {
        if (!fs.existsSync(args.archive)) {
          spinner.fail(`${args.archive} cannot be found, Please check the path of the ${args.archive} or provide a valid file.`);
          return;
        }
        data.append("upload", fs.createReadStream(args.archive));
      }

      const response = await DeployService.upload(host, data, apikey, (progress) => {
        if (!image) {
          if (progress.percent < 1) {
            const percent = Math.round(progress.percent * 100);
            const takenTime = performance.now() - startTime;
            const speed = prettyBytes(progress.transferred / (takenTime / 1000));
            spinner.text = `Uploading SPA: ${percent}% (${prettyBytes(progress.transferred)}/${prettyBytes(
              progress.total
            )}) | ${speed}/s`;
          } else {
            step = "processing";
            processTime = performance.now();
            spinner.text = `Processing archive file, this may take a while.`;
          }
        }
        else {
          step = "processing";
          processTime = performance.now();
          spinner.text = `Deploying the Application, this may take a while.`;
        }

      });
      const endTime = performance.now();
      if (!image) {
        spinner.succeed(`The file ${args.archive} deployed successfully !`);
        this.log(`Upload file took ${Math.round((processTime - startTime) / 1000)} seconds`);
        this.log(`Process file took ${Math.round((endTime - processTime) / 1000)} seconds`);
        this.log(`Total: ${Math.round((endTime - startTime) / 1000)} seconds`);
      }
      else {
        spinner.succeed(`Application deployed successfully !`);
      }
      this.log(response);
      this.log("* Please note that the deployment takes a few seconds; The Access URL will be available once it's deployed.")
    } catch (e) {
      spinner.fail(e.message);
      e.includes("ENOTFOUND")
        ? this.error(`Unable to Connect to ${host}.`, { exit: 1 })
        : this.error(e, { exit: 1 });
    }
  }

  validateActionId(actionId) {
    if (actionId.trim().toLowerCase().match(validPRId) || actionId.length > 36) {
      this.error("Please provide a valid prid  ");
    }
  }

  getRef(flags) {
    return flags.ref;
  }
}

DeployCommand.description = `deploy to a SPAship host
Send an archive containing a SPA to a SPAship host for deployment.  Supports .tar.gz/.tgz, .zip, and .tar.bz2.
`;

DeployCommand.args = [
  {
    name: "archive",
    required: false,
    default: null,
    description:
      "An archive (zip, tarball, or bzip2) file containing SPA static assets and a spaship.yaml file. You can omit this if you specify the build artifact path as `buildDir` in the spaship.yaml file.",
  },
];

DeployCommand.flags = assign(
  {
    ref: flags.string({
      char: "r",
      description: "a version tag, commit hash, or branch to identify this release",
      required: false,
      default: "undefined",
    }),
  },
  {
    path: flags.string({
      char: "p",
      description:
        "a custom URL path for your app under the SPAship domain. Defaults to the 'path' in your spaship.yaml. ex: /my/app.",
    }),
  },
  {
    builddir: flags.string({
      char: "b",
      required: false,
      description: "path of your SPAs artifact. Defaults to 'buildDir' if specified in the spaship.yaml.",
    }),
  },
  {
    buildDir: flags.string({
      required: false,
      description: "path of your SPAs artifact. Defaults to 'buildDir' if specified in the spaship.yaml.",
    }),
  },
  {
    preview: flags.boolean({
      char: "P",
      required: false,
      description: "deploying into temporary preview environment.",
    }),
  },
  {
    duration: flags.string({
      char: "d",
      required: false,
      description: "duration is to set the time (in hour) for the ephemeral preview environment.",
    }),
  },
  {
    prid: flags.string({
      required: false,
      description: "prid is to enable temporary preview environment in a optimized way. ex: pass the pull request id.",
    }),
  },
  {
    image: flags.string({
      required: false,
      description: "image (url) for the containerized deployment [SSR].",
    }),
  },
  {
    file: flags.string({
      required: false,
      description: "spaship.yaml file link.",
    }),
  },
  commonFlags.apikey,
  commonFlags.env
);

DeployCommand.examples = [
  `$ npm pack && spaship deploy your-app-1.0.0.tgz # deploying an archive created with npm pack`,
  `$ spaship deploy # deploying a buildDir directory`,
];

module.exports = DeployCommand;
