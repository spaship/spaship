const { Router } = require("express");
const clearData = require("../../controllers/scripts/clearData");
const eventDataDump = require("../../controllers/scripts/eventDataDump");
const eventTimeMatricesDump = require("../../controllers/scripts/eventTimeMatricesDump");
const websiteDataDump = require("../../controllers/scripts/websiteDataDump");
const router = new Router();

router.post("/events", eventDataDump);
router.post("/eventsTime", eventTimeMatricesDump);
router.post("/website", websiteDataDump);
router.post("/remove", clearData);

module.exports = router;