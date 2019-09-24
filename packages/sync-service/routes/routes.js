const deploy = require("./deploy/deploy");
const list = require("./list/list");
const fs = require("fs");
const path = require("path");
const forceSyncAll = require("./forceSyncAll/forceSyncAll");

function register(app) {
  app.route("/").get((req, res) => res.redirect("/deploy"));

  app
    .route("/deploy")
    .post(...deploy())
    .get((req, res) => {
      fs.readFile(path.resolve(__dirname, "..", "index.html"), (err, data) => {
        res.send(data.toString());
      });
    });

  app.route("/list").get(list());

  app.post("/autosync/forceSyncAll", forceSyncAll());
}

module.exports = { register };
