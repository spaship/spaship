const yargs = require("yargs");
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

var test_host = argv.host;
var test_username = argv.username;
var test_pass = argv.passw;

const cypress = require("cypress");
cypress
  .run({
    spec: "./cypress/integration/spa_spec.js",
    screenshotsFolder: "cypress/videos",
    reporter: "mochawesome",
    reporterOptions: {
      reportDir: "cypress/reports",
      reportTitle: "E2Etest Test",
      reportFilename: "E2E_report",
      charts: true,
      overwrite: true,
      html: true,
      json: false,
    },
    env: {
      host: test_host,
      username: test_username,
      passw: test_pass,
    },
  })
  .then((results) => {
    console.log(results);
  })
  .catch((err) => {
    console.error(err);
  });
