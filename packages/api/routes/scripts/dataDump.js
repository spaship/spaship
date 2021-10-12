const { Router } = require("express");
const clearData = require("../../controllers/scripts/clearData");
const eventDataDump = require("../../controllers/scripts/eventDataDump");
const eventTimeMatricesDump = require("../../controllers/scripts/eventTimeMatricesDump");
const webPropertyDataDump = require("../../controllers/scripts/webPropertyDataDump");
const router = new Router();

router.post("/events", eventDataDump.eventDataDump);
router.post("/eventstime", eventTimeMatricesDump.eventTimeMatricesDump);
router.post("/webproperty", webPropertyDataDump.webPropertyDataDump);
router.post("/remove", clearData.clearData);

module.exports = router;
