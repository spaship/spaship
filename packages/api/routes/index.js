const { Router } = require("express");

const applications = require("./applications");
const apiKeys = require("./apiKeys");
const event = require("./event");
const webProperty = require("./webProperty");
const dataDump = require("./scripts/dataDump");
const eventDataDump = require("../controllers/scripts/eventDataDump");
const router = new Router();

const v1 = new Router();
const experiment = new Router();

v1.use("/applications", applications);
v1.use("/apiKeys", apiKeys);
v1.use("/event", event);
v1.use("/webproperty", webProperty);

router.use("/v1", v1);

experiment.use("/desarrollo", dataDump);
router.use("/experimentar", experiment);

module.exports = router;
