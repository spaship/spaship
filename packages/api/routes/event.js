const { Router } = require("express");
const findAllEvents = require("../controllers/metric/findAllEvents");
const findEventById = require("../controllers/metric/findEventById");
const findEventByProperty = require("../controllers/metric/findEventByProperty");
const saveEvents = require("../controllers/metric/saveEvent");
const getDeploymentPerProperty = require("../controllers/metric/eventCountAnalysis/getAllDeploymentPropertyAnalysis");
const getPropertyCountByCode  = require("../controllers/metric/eventCountAnalysis/getPropertyCountByCode");
const getPropertyCountBySpanameAndCode  = require("../controllers/metric/eventCountAnalysis/getPropertyCountBySpanameAndCode");
const getPropertyCountBySpaname  = require("../controllers/metric/eventCountAnalysis/getPropertyCountBySpaname");
const getLatestActivities = require("../controllers/metric/getLatestActivities");
const getDeploymentCountByPropertyName = require("../controllers/metric/eventCountAnalysis/property/getDeploymentCountByPropertyName");
const getDeploymentCountBySPAName = require("../controllers/metric/eventCountAnalysis/property/getDeploymentCountBySPAName");
const getDeploymentCountForAllProperty = require("../controllers/metric/eventCountAnalysis/property/getDeploymentCountForAllProperty");
const getLatestActivitiesByProperty = require("../controllers/metric/eventCountAnalysis/property/getLatestActivitiesByProperty");
const getPropertyCountByEnvChart = require("../controllers/metric/eventCountAnalysis/property/getPropertyCountByEnvChart");
const getPropertyCountByEnvWeeklyChart = require("../controllers/metric/eventCountAnalysis/property/getPropertyCountByEnvWeeklyChart");
const getLatestActivitiesBySPAName = require("../controllers/metric/eventCountAnalysis/property/getLatestActivitiesBySPAName");
const getSPANameCountByEnvChart = require("../controllers/metric/eventCountAnalysis/property/getSPANameCountByEnvChart");
const getSPANameCountByEnvWeeklyChart = require("../controllers/metric/eventCountAnalysis/property/getSPANameCountByEnvWeeklyChart");
const getCountByEnvChart = require("../controllers/metric/eventCountAnalysis/property/getCountByEnvChart");
const getCountByEnvWeeklyChart = require("../controllers/metric/eventCountAnalysis/property/getCountByEnvWeeklyChart");
const getTimeFrameForPropertyChart = require("../controllers/metric/eventCountAnalysis/property/getTimeFrameForPropertyChart");

const router = new Router();

router.get("/", findAllEvents);

router.post("/", saveEvents);

router.get("/find/property/:propertyName", findEventByProperty);

router.get("/find/id/:id", findEventById);

router.get("/get/count/property/all", getDeploymentPerProperty);

router.get("/get/count/property/code", getPropertyCountByCode);

router.get("/get/count/property/spaname", getPropertyCountBySpaname);

router.get("/get/count/property/spaname/code", getPropertyCountBySpanameAndCode);

router.get("/get/latest/activities", getLatestActivities);

router.get("/get/:propertyName/count/property/spaname", getDeploymentCountByPropertyName);

router.get("/get/property/spaname/count/:spaName/:propertyName", getDeploymentCountBySPAName);

router.get("/get/all/property/count", getDeploymentCountForAllProperty);




router.get("/get/latest/activities/:propertyName", getLatestActivitiesByProperty);

router.get("/get/spaName/latest/activities/:spaName/:propertyName", getLatestActivitiesBySPAName);


router.get("/get/chart/property/env/:propertyName", getPropertyCountByEnvChart);

router.get("/get/chart/spaName/env/:spaName/:propertyName", getSPANameCountByEnvChart);



router.get("/get/chart/month/property/env/:propertyName", getPropertyCountByEnvWeeklyChart);

router.get("/get/chart/month/spaName/env/:spaName/:propertyName", getSPANameCountByEnvWeeklyChart);



router.get("/get/chart/all/property/env", getCountByEnvChart);

router.get("/get/chart/all/env", getCountByEnvWeeklyChart);


router.get("/get/timeFrame/month/property/env/:propertyName", getTimeFrameForPropertyChart);

module.exports = router;
