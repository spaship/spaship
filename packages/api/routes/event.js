const { Router } = require("express");
const getDeploymentPerProperty = require("../controllers/propertyServices/allProperyServices/getAllDeploymentPropertyAnalysis");
const getPropertyCountByCode = require("../controllers/propertyServices/allProperyServices/getPropertyCountByCode");
const getPropertyCountBySpanameAndCode = require("../controllers/propertyServices/allProperyServices/getPropertyCountBySpanameAndCode");
const getPropertyCountBySpaname = require("../controllers/propertyServices/allProperyServices/getPropertyCountBySpaname");
const getDeploymentCountByPropertyName = require("../controllers/propertyServices/perPropertyServices/getDeploymentCountByPropertyName");
const getDeploymentCountBySPAName = require("../controllers/spaServices/getDeploymentCountBySPAName");
const getDeploymentCountForAllProperty = require("../controllers/propertyServices/allProperyServices/getDeploymentCountForAllProperty");
const getLatestActivitiesByProperty = require("../controllers/propertyServices/perPropertyServices/getLatestActivitiesByProperty");
const getPropertyCountByEnvChart = require("../controllers/propertyServices/perPropertyServices/getPropertyCountByEnvChart");
const getPropertyCountByEnvWeeklyChart = require("../controllers/propertyServices/perPropertyServices/getPropertyCountByEnvWeeklyChart");
const getLatestActivitiesBySPAName = require("../controllers/spaServices/getLatestActivitiesBySPAName");
const getSPANameCountByEnvChart = require("../controllers/spaServices/getSPANameCountByEnvChart");
const getSPANameCountByEnvWeeklyChart = require("../controllers/spaServices/getSPANameCountByEnvWeeklyChart");
const getCountByEnvChart = require("../controllers/propertyServices/allProperyServices/getCountByEnvChart");
const getCountByEnvWeeklyChart = require("../controllers/propertyServices/allProperyServices/getCountByEnvWeeklyChart");
const getTimeFrameForPropertyChart = require("../controllers/propertyServices/perPropertyServices/getTimeFrameForPropertyChart");
const getSearchResultForSPA = require("../controllers/spaServices/getSearchResultForSPA");

const router = new Router();

router.get("/get/count/property/all", getDeploymentPerProperty.getAllDeploymentPropertyAnalysis);

router.get("/get/count/property/code", getPropertyCountByCode.getPropertyCountByCode);

router.get("/get/count/property/spaname", getPropertyCountBySpaname.getPropertyCountBySpaname);

router.get("/get/count/property/spaname/code", getPropertyCountBySpanameAndCode.getPropertyCountBySpanameAndCode);

router.get(
  "/get/:propertyName/count/property/spaname",
  getDeploymentCountByPropertyName.getDeploymentCountByPropertyName
);

router.get(
  "/get/property/spaname/count/:spaName/:propertyName",
  getDeploymentCountBySPAName.getDeploymentCountBySPAName
);

router.get("/get/all/property/count", getDeploymentCountForAllProperty.getDeploymentCountForAllProperty);

router.get("/get/latest/activities/:propertyName", getLatestActivitiesByProperty.getLatestActivitiesByProperty);

router.get(
  "/get/spaname/latest/activities/:spaName/:propertyName",
  getLatestActivitiesBySPAName.getLatestActivitiesBySPAName
);

router.get("/get/chart/property/env/:propertyName", getPropertyCountByEnvChart.getPropertyCountByEnvChart);

router.get("/get/chart/spaname/env/:spaName/:propertyName", getSPANameCountByEnvChart.getSPANameCountByEnvChart);

router.get(
  "/get/chart/month/property/env/:propertyName",
  getPropertyCountByEnvWeeklyChart.getPropertyCountByEnvWeeklyChart
);

router.get(
  "/get/chart/month/spaname/env/:spaName/:propertyName",
  getSPANameCountByEnvWeeklyChart.getSPANameCountByEnvWeeklyChart
);

router.get("/get/chart/all/property/env", getCountByEnvChart.getCountByEnvChart);

router.get("/get/chart/all/env", getCountByEnvWeeklyChart.getCountByEnvWeeklyChart);

router.get(
  "/get/timeframe/month/property/env/:propertyName",
  getTimeFrameForPropertyChart.getTimeFrameForPropertyChart
);

router.get("/get/search/spaname/:searchQuery", getSearchResultForSPA.getSearchResultForSPA);

module.exports = router;
