const http = require("http");
const { log } = require("@spaship/common/lib/logging/pino");
const config = require("./config");
const AutoSync = require("./lib/autoSync");

const autoSync = new AutoSync();
const host = config.get("host");
const port = config.get("port");

const server = http.createServer((req, res) => {
  if (req.url === "/force" && req.method === "GET") {
    autoSync.forceSyncAll();
    res.send("Forcing all autoSync targets to sync now");
  }
});

server.listen(port, host, () => {
  log.info(`Server is listening on port ${port} of ${host} 🚀`);
  log.info(`config: ${config.toString()}`);
});

if (config.get("autosync:enabled")) {
  autoSync.start();
  if (config.get("autosync:onstart")) {
    autoSync.forceSyncAll();
  }
}
