const deploy = require("./deploy/deploy");
const list = require("./list/list");
const fs = require("fs");
const path = require("path");
const forceSyncAll = require("./forceSyncAll/forceSyncAll");
const corsMiddleware = require("cors");

const cors = corsMiddleware({
  origin: true,
  credentials: true
});

function register(app) {
  // Add `cors` to each request that needs CORS headers. See existing
  // cors-enabled routes for examples.

  app.route("/").get((req, res) => res.redirect("/deploy"));

  app
    .route("/deploy")
    .post(cors, ...deploy())
    .get((req, res) => {
      fs.readFile(path.resolve(__dirname, "..", "index.html"), (err, data) => {
        res.send(data.toString());
      });
    });

  app.route("/list").get(cors, list());

  app.post("/autosync/forceSyncAll", cors, forceSyncAll());
}

module.exports = { register };
