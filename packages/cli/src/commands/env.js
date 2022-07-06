const { Command, flags } = require("@oclif/command");
const fs = require("fs");
const { loadRcFile } = require("../common/spashiprc-loader");
const { assign, get, isEmpty, omit } = require("lodash");
const { config } = require("../common/config/index");
const commonFlags = require("../common/flags");
const os = require("os");
//process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

class EnvCommand extends Command {
  async run() {
    let existingConfig;
    const userHomeDir = os.homedir();
    try {
      await config.read(`${userHomeDir}/.spashiprc.yml`);
      existingConfig = true;
    } catch (e) {
      existingConfig = false;
    }
    const { flags } = this.parse(EnvCommand);

    //  const cmd = this.parse(EnvCommand);
    const dataObj = {};
    dataObj[flags.name] = { apikey: flags.apikey, url: flags.url };
    const finalObj = { envs: dataObj };
    try {
      if (!existingConfig) {
        await config.write(`${userHomeDir}/.spashiprc.yml`, JSON.parse(JSON.stringify(finalObj)));
      } else {
        let yamlData = await config.read(`${userHomeDir}/.spashiprc.yml`);
        yamlData.envs = { ...yamlData.envs, ...dataObj };
        await config.append(`${userHomeDir}/.spashiprc.yml`, JSON.parse(JSON.stringify(yamlData)));
      }
      this.log("Generated .spashiprc.yaml at " + userHomeDir);
    } catch (error) {
      this.log(error);
    }
  }
}

EnvCommand.flags = assign(
  {
    name: flags.string({
      char: "n",
      description: "name of the environment",
      required: false,
      default: "undefined",
    }),
  },
  {
    url: flags.string({
      char: "u",
      description: "url of the environment",
      required: false,
      default: "undefined",
    }),
  },
  commonFlags.apikey
);

EnvCommand.description = `set env for .spashiprc.yml file (for setting environment & authentication).
`;

module.exports = EnvCommand;
