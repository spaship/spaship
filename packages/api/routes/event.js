const { Router } = require("express");
const findAllEvents = require("../controllers/reports/deprecatedServices/findAllEvents");
const findEventById = require("../controllers/reports/deprecatedServices/findEventById");
const findEventByProperty = require("../controllers/reports/deprecatedServices/findEventByProperty");
const getDeploymentPerProperty = require("../controllers/reports/propertyServices/allProperyServices/getAllDeploymentPropertyAnalysis");
const getPropertyCountByCode  = require("../controllers/reports/propertyServices/allProperyServices/getPropertyCountByCode");
const getPropertyCountBySpanameAndCode  = require("../controllers/reports/propertyServices/allProperyServices/getPropertyCountBySpanameAndCode");
const getPropertyCountBySpaname  = require("../controllers/reports/propertyServices/allProperyServices/getPropertyCountBySpaname");
const getLatestActivities = require("../controllers/reports/deprecatedServices/getLatestActivities");
const getDeploymentCountByPropertyName = require("../controllers/reports/propertyServices/perPropertyServices/getDeploymentCountByPropertyName");
const getDeploymentCountBySPAName = require("../controllers/reports/spaServices/getDeploymentCountBySPAName");
const getDeploymentCountForAllProperty = require("../controllers/reports/propertyServices/allProperyServices/getDeploymentCountForAllProperty");
const getLatestActivitiesByProperty = require("../controllers/reports/propertyServices/perPropertyServices/getLatestActivitiesByProperty");
const getPropertyCountByEnvChart = require("../controllers/reports/propertyServices/perPropertyServices/getPropertyCountByEnvChart");
const getPropertyCountByEnvWeeklyChart = require("../controllers/reports/propertyServices/perPropertyServices/getPropertyCountByEnvWeeklyChart");
const getLatestActivitiesBySPAName = require("../controllers/reports/spaServices/getLatestActivitiesBySPAName");
const getSPANameCountByEnvChart = require("../controllers/reports/spaServices/getSPANameCountByEnvChart");
const getSPANameCountByEnvWeeklyChart = require("../controllers/reports/spaServices/getSPANameCountByEnvWeeklyChart");
const getCountByEnvChart = require("../controllers/reports/propertyServices/allProperyServices/getCountByEnvChart");
const getCountByEnvWeeklyChart = require("../controllers/reports/propertyServices/allProperyServices/getCountByEnvWeeklyChart");
const getTimeFrameForPropertyChart = require("../controllers/reports/propertyServices/perPropertyServices/getTimeFrameForPropertyChart");
const getSearchResultForSPA = require("../controllers/reports/spaServices/getSearchResultForSPA");

const router = new Router();

router.get("/", findAllEvents);

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

router.get("/get/search/spaName/:searchQuery", getSearchResultForSPA);


module.exports = router;