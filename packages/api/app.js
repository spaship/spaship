const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");
const { pinoExpress } = require("@spaship/common/lib/logging/pino");
const authentication = require("./middlewares/authentication");
const responseWrapper = require("./middlewares/responseWrapper");
const errorHandler = require("./middlewares/errorHandler");
const { liveness, readiness } = require("./health");
const routes = require("./routes");

const swaggerDocument = yaml.safeLoad(fs.readFileSync(path.join(__dirname, "openapi.yml"), "utf8"));

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
  .use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  .use("/api", authentication(), routes)
  .use(errorHandler());

module.exports = app;
