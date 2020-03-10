const fs = require("fs");
const path = require("path");
const corsMiddleware = require("cors");

// include our middlewares
const forceSyncAll = require("./forceSyncAll/forceSyncAllMiddleware");
const deploy = require("./deploy/deployMiddleware");
const list = require("./list/listMiddleware");
const auth = require("./authMiddleware");

const { protect } = require("./keycloakMiddleware");

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

  app
    .route("/list")
    .get(cors, protect(), list())
    // .get(cors, auth(), list())
    .options(cors); // for CORS preflight

  app.post("/autosync/forceSyncAll", cors, forceSyncAll());
}

module.exports = { register };
