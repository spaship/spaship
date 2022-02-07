const { Router } = require("express");
const produceEvent = require("../controllers/operatorServices/produceEvent");
const analyzeRepository = require("../controllers/webProperties/analyzeRepository");
const getSPAList = require("../controllers/webProperties/getSPAList");
const getWebPropertyList = require("../controllers/webProperties/getWebPropertyList");
const gitOperations = require("../controllers/webProperties/gitOperations");

const router = new Router();

router.post("/", gitOperations);

router.get("/list", getWebPropertyList.getWebPropertyList);

router.get("/getspalist/:webPropertyPropertyName", getSPAList.getSPAList);

router.post("/analyze/repository", analyzeRepository);

router.get("/activities/:id", produceEvent);

module.exports = router;
