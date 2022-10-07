const { log } = require("@spaship/common/lib/logging/pino");
const app = require("./app");
const db = require("./db");
const { agenda } = require("./agenda");
const config = require("./config");
const pkgJSON = require("./package.json");
const consumeSSE = require("./controllers/operatorServices/event/consumeEvent");
const { initializeDeleteJobs } = require("./utils/agenda-jobs/initializeDeleteJobs");

if (process.env.NODE_ENV === "production") {
  log.info(config.toObject(), `Starting SPAship ${pkgJSON.version} with the following settings`);
} else {
  log.info(
    config.toObject(),
    `
███████╗██████╗  █████╗ ███████╗██╗  ██╗██╗██████╗  ██╗
██╔════╝██╔══██╗██╔══██╗██╔════╝██║  ██║██║██╔══██╗ ╚██╗
███████╗██████╔╝███████║███████╗███████║██║██████╔╝  ╚██╗
╚════██║██╔═══╝ ██╔══██║╚════██║██╔══██║██║██╔═══╝   ██╔╝
███████║██║     ██║  ██║███████║██║  ██║██║██║      ██╔╝
╚══════╝╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝      ╚═╝
Starting SPAship version ${pkgJSON.version}.

Listening on http://${config.get("host")}:${config.get("port")}

Configuration:`
  );
}

(async () => {
  let server = app.listen(config.get("port"), () => {
    log.info("Server started ! - spaship api");
  });
  try {
    await db.connect();
    consumeSSE();
    await initializeDeleteJobs();
    await agenda.start();
  } catch (error) {
    console.log(error);
  }
  server.timeout = 0; // no timeout
  // server.keepAliveTimeout = 300000;
})();
