const http = require("http");
const config = require("./config");
const AutoSync = require("./lib/autoSync");

console.log(config.get("port"));

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
  console.log(`Server is listening on port ${port} of ${host} 🚀`);
  console.log(`config: ${config.toString()}`);
});

if (config.get("enabled")) {
  autoSync.start();
  if (config.get("onstart")) {
    autoSync.forceSyncAll();
  }
}
