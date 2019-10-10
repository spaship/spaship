const path = require("path");
const { Command, flags } = require("@oclif/command");
const execa = require("execa");

class DeployCommand extends Command {
  async run() {
    const { args, flags } = this.parse(DeployCommand);
    this.log(`Deploying SPA...`);
    try {
      const { stdout, stderr } = await execa.command(
        `curl http://spaship.usersys.redhat.com:8008/deploy -X POST -F upload=@${args.archive} -F ref=${flags.ref} -v`
      );
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
    description: "SPA archive file"
  }
];

DeployCommand.flags = {
  ref: flags.string({
    char: "r",
    description:
      "a version tag, commit hash, or branch to identify this release",
    required: false,
    default: "undefined"
  })
};

module.exports = DeployCommand;
