const { flags } = require("@oclif/command");
const { loadRcFile } = require("../common/spashiprc-loader");

const config = loadRcFile();

/**
 * Reusable CLI flags that can be shared between multiple commands.
 *
 * The nested property names do look redundant, but the nesting is important.
 */
module.exports = {
  apikey: {
    apikey: flags.string({
      description: "a SPAship API key",
      required: false,
    }),
  },
  env: {
    env: flags.string({
      char: "e",
      description:
        "either the name of a SPAship environment as defined in your .spashiprc.yml file, or a URL to a SPAship environment",
      required: false,
      default: "default",
    }),
  },
};
