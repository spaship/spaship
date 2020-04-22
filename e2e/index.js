const yargs = require("yargs");
const cypress = require("cypress");

const argv = yargs
  .option("host", {
    alias: "e",
    description: "the host to test",
    type: "string",
  })
  .option("username", {
    alias: "u",
    describe: "the login username",
    type: "string",
  })
  .option("passw", {
    alias: "p",
    describe: "the login password",
    type: "string",
  })
  .help()
  .alias("help", "h").argv;

cypress
  .run({
    configFile: false,
    reporter: "mochawesome",
    reporterOptions: {
      reportDir: "cypress/reports",
      reportTitle: "SPAship Manager E2E reports",
      reportFilename: "index",
      charts: true,
      overwrite: true,
      html: true,
      json: false,
    },
    env: argv,
  })
  .then((results) => {
    console.log(results);
  })
  .catch((err) => {
    console.error(err);
  });
