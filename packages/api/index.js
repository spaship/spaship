const { log } = require("@spaship/common/lib/logging/pino");
const app = require("./app");
const db = require("./db");
const config = require("./config");
const pkgJSON = require("./package.json");

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
  await db.connect();
  let server = app.listen(config.get("port"), () => {
    log.info("Server started !");
  });

  server.timeout = 0; // no timeout
  // server.keepAliveTimeout = 300000;
})();
