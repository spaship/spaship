const fs = require("fs");
const path = require("path");
const corsMiddleware = require("cors");

// include our endpoint middlewares
const forceSyncAll = require("./forceSyncAll/forceSyncAllMiddleware");
const deploy = require("./deploy/deployMiddleware");
const list = require("./list/listMiddleware");

const getAPIKeysByUser = require("./apikeys/key/getKeysByUserMiddleware");
const deleteAPIKeysByUser = require("./apikeys/user/deleteKeysByUserMiddleware");

const getUserByAPIKey = require("./apikeys/user/getUserByKeyMiddleware");
const createAPIKey = require("./apikeys/key/createKeyMiddleware");
const deleteAPIKey = require("./apikeys/key/deleteKeyMiddleware");

// include our auth middlewares
const auth = require("./authMiddleware");
const jwt = require("./jwtMiddleware");
const apiKey = require("./apiKeyMiddleware");

const cors = corsMiddleware({
  origin: true,
  credentials: true,
});

function register(app) {
  // Add `cors` to each request that needs CORS headers. See existing
  // cors-enabled routes for examples.

  app.route("/").get((req, res) => res.redirect("/deploy"));

  app
    .route("/deploy")
    .post(cors, auth(jwt(), apiKey()), ...deploy())
    .get((req, res) => {
      fs.readFile(path.resolve(__dirname, "..", "index.html"), (err, data) => {
        res.send(data.toString());
      });
    });

  app.route("/list").get(cors, auth(apiKey(), jwt()), list()).options(cors); // for CORS preflight

  app.post("/autosync/forceSyncAll", cors, auth(apiKey(), jwt()), forceSyncAll());

  // API Keys
  app
    .route("/apikey")
    .get(cors, auth(jwt(), apiKey()), getAPIKeysByUser())
    .post(cors, auth(jwt()), createAPIKey())
    .delete(cors, auth(jwt(), apiKey()), deleteAPIKey());

  app
    .route("/user")
    .get(cors, auth(jwt(), apiKey()), getUserByAPIKey())
    .delete(cors, auth(jwt(), apiKey()), deleteAPIKeysByUser());
}
module.exports = { register };
