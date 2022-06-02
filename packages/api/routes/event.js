const { Router } = require("express");
const getSearchResultForSPA = require("../controllers/operatorServices//operations/getSearchResultForSPA");
const analyticsServiceAll = require("../controllers/operatorServices/analytics/analyticsServiceAll");
const analyticsServiceFilter = require("../controllers/operatorServices/analytics/analyticsServiceFilter");

const router = new Router();

router.post("/fetch/analytics/all", analyticsServiceAll.analyticsServiceAll);

router.post("/fetch/analytics/filter", analyticsServiceFilter.analyticsServiceFilter);

router.get("/get/search/spa", getSearchResultForSPA.getSearchResultForSPA);

router.get("/get/search/spa/:searchQuery", getSearchResultForSPA.getSearchResultForSPA);

module.exports = router;
