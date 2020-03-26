const URL = require("url").URL;
const { Command, flags } = require("@oclif/command");
const execa = require("execa");
const { assign } = require("lodash");
const commonFlags = require("../common/flags");
const { loadRcFile } = require("../common/spashiprc-loader");

function isURL(s) {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
}

class DeployCommand extends Command {
  async run() {
    const { args, flags } = this.parse(DeployCommand);
    const config = loadRcFile();

    // if --env is a properly formatted URL, use it as the SPAship host, otherwise treat is as the name of a SPAship
    // environment.
    const envIsURL = isURL(flags.env);
    let host;

    if (envIsURL) {
      host = flags.env;
    } else {
      host = config.envs[flags.env];
    }

    if (!host) {
      this.error(`The requested environment, "${flags.env}", is not defined in your spashiprc file.`);
    }

    if (!flags.apikey) {
      this.error(`An API key must be provided, either in your spashiprc file or in a --apikey CLI option.`);
    }
    this.log(`Deploying SPA to ${flags.env}${envIsURL ? "" : ` (${host})`}`);
    try {
      const cmd = `curl ${host}/deploy -H 'Authorization: APIKey ${flags.apikey}' -F upload=@${args.archive} -F ref=${flags.ref}`;
      console.log(cmd);
      const { stdout } = await execa.command(cmd, { shell: true });
      this.log(stdout);
    } catch (e) {
      this.error(e);
    }
  }
}

DeployCommand.description = `deploy to a SPAship host
Send an archive containing a SPA to a SPAship host for deployment.  Supports .tar.gz/.tgz, .zip, and .tar.bz2.
`;

DeployCommand.args = [
  {
    name: "archive",
    required: true,
    description: "SPA archive file",
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
  commonFlags.apikey,
  commonFlags.env
);

DeployCommand.examples = [`$ npm pack`, `$ spaship deploy your-app-1.0.0.tgz`];

module.exports = DeployCommand;
