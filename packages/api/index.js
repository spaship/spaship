const { log } = require("@spaship/common/lib/logging/pino");
const app = require("./app");
const db = require("./db");
const config = require("./config");
const pkgJSON = require("./package.json");

(async () => {
  await db.connect();
  app.listen(config.get("port"), () => {
    if (process.env.NODE_ENV === "production") {
      log.info(config.toObject(), `Starting SPAship ${npmPackage.version} with the following settings`);
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
  });
})();
