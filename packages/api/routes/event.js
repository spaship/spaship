const { Router } = require("express");
const getSearchResultForSPA = require("../controllers/webPropertyServices/utils/getSearchResultForSPA");
const analyticsServiceAll = require("../controllers/services/analyticsServiceAll");
const analyticsServiceFilter = require("../controllers/services/analyticsServiceFilter");

const router = new Router();

router.post("/fetch/analytics/all", analyticsServiceAll.analyticsServiceAll);

router.post("/fetch/analytics/filter", analyticsServiceFilter.analyticsServiceFilter);

router.get("/get/search/spa/:searchQuery", getSearchResultForSPA.getSearchResultForSPA);

module.exports = router;
