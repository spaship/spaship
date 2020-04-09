const http = require("http");
const { log } = require("@spaship/common/lib/logging/pino");
const config = require("./config");
const Autosync = require("./lib/autosync");

const autosync = new Autosync();
const port = config.get("port");

const requestListener = function (req, res) {
  if (req.url === "/force" && req.method === "GET") {
    autosync.forceSyncAll();
    res.writeHead(200);
    res.end("Forcing all autosync targets to sync now");
    return;
  }
  res.writeHead(200);
  res.end("I'm alive");
};

const server = http.createServer(requestListener);

server.listen(port, () => {
  log.info(`Server is listening on port ${port} 🚀`);
  log.info(`config: ${config.toString()}`);
});

if (config.get("autosync:enabled")) {
  autosync.start();
  if (config.get("autosync:onstart")) {
    autosync.forceSyncAll();
  }
}
