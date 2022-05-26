const { Router } = require("express");
const clearData = require("../../controllers/scripts/clearData");
const eventDataDump = require("../../controllers/scripts/eventDataDump");
const eventTimeMatricesDump = require("../../controllers/scripts/eventTimeMatricesDump");
const webPropertyDataDump = require("../../controllers/scripts/webPropertyDataDump");
const aliasDataDump = require("../../controllers/scripts/aliasDataDump");
const applicationDataDump = require("../../controllers/scripts/applicationDataDump");
const router = new Router();

router.post("/events", eventDataDump.eventDataDump);
router.post("/eventstime", eventTimeMatricesDump.eventTimeMatricesDump);
router.post("/webproperty", webPropertyDataDump.webPropertyDataDump);
router.post("/alias", aliasDataDump.aliasDataDump);
router.post("/remove", clearData.clearData);
router.post("/applications", applicationDataDump.applicationsService);
module.exports = router;
