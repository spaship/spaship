const { Router } = require("express");
const getDeploymentPerProperty = require("../controllers/reports/propertyServices/allProperyServices/getAllDeploymentPropertyAnalysis");
const getPropertyCountByCode  = require("../controllers/reports/propertyServices/allProperyServices/getPropertyCountByCode");
const getPropertyCountBySpanameAndCode  = require("../controllers/reports/propertyServices/allProperyServices/getPropertyCountBySpanameAndCode");
const getPropertyCountBySpaname  = require("../controllers/reports/propertyServices/allProperyServices/getPropertyCountBySpaname");
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

router.get("/get/count/property/all", getDeploymentPerProperty.getAllDeploymentPropertyAnalysis);

router.get("/get/count/property/code", getPropertyCountByCode.getPropertyCountByCode);

router.get("/get/count/property/spaname", getPropertyCountBySpaname.getPropertyCountBySpaname);

router.get("/get/count/property/spaname/code", getPropertyCountBySpanameAndCode.getPropertyCountBySpanameAndCode);

router.get("/get/:propertyName/count/property/spaname", getDeploymentCountByPropertyName.getDeploymentCountByPropertyName);

router.get("/get/property/spaname/count/:spaName/:propertyName", getDeploymentCountBySPAName.getDeploymentCountBySPAName);

router.get("/get/all/property/count", getDeploymentCountForAllProperty.getDeploymentCountForAllProperty);

router.get("/get/latest/activities/:propertyName", getLatestActivitiesByProperty.getLatestActivitiesByProperty);

router.get("/get/spaName/latest/activities/:spaName/:propertyName", getLatestActivitiesBySPAName.getLatestActivitiesBySPAName);


router.get("/get/chart/property/env/:propertyName", getPropertyCountByEnvChart.getPropertyCountByEnvChart);

router.get("/get/chart/spaName/env/:spaName/:propertyName", getSPANameCountByEnvChart.getSPANameCountByEnvChart);

router.get("/get/chart/month/property/env/:propertyName", getPropertyCountByEnvWeeklyChart.getPropertyCountByEnvWeeklyChart);

router.get("/get/chart/month/spaName/env/:spaName/:propertyName", getSPANameCountByEnvWeeklyChart.getSPANameCountByEnvWeeklyChart);


router.get("/get/chart/all/property/env", getCountByEnvChart.getCountByEnvChart);

router.get("/get/chart/all/env", getCountByEnvWeeklyChart.getCountByEnvWeeklyChart);

router.get("/get/timeFrame/month/property/env/:propertyName", getTimeFrameForPropertyChart.getTimeFrameForPropertyChart);

router.get("/get/search/spaName/:searchQuery", getSearchResultForSPA.getSearchResultForSPA);

module.exports = router;