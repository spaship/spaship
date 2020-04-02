const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const { pinoExpress } = require("@spaship/common/lib/logging/pino");
const authentication = require("./middlewares/authentication");
const responseWrapper = require("./middlewares/responseWrapper");
const errorHandler = require("./middlewares/errorHandler");
const { liveness, readiness } = require("./health");
const routes = require("./routes");

const app = new express();
app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cors())
  .use(helmet())
  .use(compression())
  .use(pinoExpress)
  .use(responseWrapper())
  .get("/liveness", liveness)
  .get("/readiness", readiness)
  .use("/api", authentication(), routes)
  .use(errorHandler());

module.exports = app;
