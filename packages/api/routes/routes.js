const fs = require("fs");
const path = require("path");
const corsMiddleware = require("cors");

// include our middlewares
const forceSyncAll = require("./forceSyncAll/forceSyncAllMiddleware");
const deploy = require("./deploy/deployMiddleware");
const list = require("./list/listMiddleware");

const getAPIKeysByUser = require("./apikeys/key/getKeysByUserMiddleware");
const deleteAPIKeysByUser = require("./apikeys/user/deleteKeysByUserMiddleware");

const getUserByAPIKey = require("./apikeys/user/getUserByKeyMiddleware");
const createAPIKey = require("./apikeys/key/createKeyMiddleware");
const deleteAPIKey = require("./apikeys/key/deleteKeyMiddleware");

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

  // API Keys
  app
    .route("/apikey")
    .get(cors, getAPIKeysByUser())
    .post(cors, createAPIKey())
    .delete(cors, deleteAPIKey());

  app
    .route("/user")
    .get(cors, getUserByAPIKey())
    .delete(cors, deleteAPIKeysByUser());
}
module.exports = { register };
