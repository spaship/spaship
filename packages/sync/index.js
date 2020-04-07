const http = require("http");
const { log } = require("@spaship/common/lib/logging/pino");
const config = require("./config");
const AutoSync = require("./lib/autoSync");

const autoSync = new AutoSync();
const port = config.get("port");

const requestListener = async function (req, res) {
  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200);
    res.end("I'm alive");
  } else if (req.url === "/force" && req.method === "GET") {
    await autoSync.forceSyncAll();
    res.writeHead(200);
    res.end("Forcing all autoSync targets to sync now");
  }
};

const server = http.createServer(requestListener);

server.listen(port, () => {
  log.info(`Server is listening on port ${port} 🚀`);
  log.info(`config: ${config.toString()}`);
});

if (config.get("autosync:enabled")) {
  autoSync.start();
  if (config.get("autosync:onstart")) {
    autoSync.forceSyncAll();
  }
}
