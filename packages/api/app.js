const express = require("express");
const expressSanitizer = require('express-sanitizer');
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
const checkAccess = require("./middlewares/checkAccess");
const responseWrapper = require("./middlewares/responseWrapper");
const errorHandler = require("./middlewares/errorHandler");
const { liveness, readiness } = require("./health");
const config = require("./config");
const routes = require("./routes");
const swaggerDocument = yaml.safeLoad(fs.readFileSync(path.join(__dirname, "openapi.yml"), "utf8"));
const app = new express();
const consumeSSE = require("./controllers/operatorServices/consumeEvent.js")
app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(expressSanitizer())
  .use(cors())
  .use(helmet())
  .use(compression())
  .use(pinoExpress)
  .use(responseWrapper())
  .get("/liveness", liveness)
  .get("/readiness", readiness)
  .use('/spas', express.static(path.join(__dirname, config.get("directoryBasePath"))) )
  .use(
    "/api-docs",
    (req, res, next) => {
      swaggerDocument.servers[0].url = `${req.get("host")}/api/v1`;
      req.swaggerDoc = swaggerDocument;
      next();
    },
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
  )
  .use("/api", [authentication(), checkAccess()], routes)
  .use(errorHandler());

module.exports = app;
