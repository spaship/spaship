const { Router } = require("express");
const produceEvent = require("../controllers/operatorServices/event/produceEvent");
const analyzeRepository = require("../controllers/deprecated/webProperties/analyzeRepository");
const getSPAList = require("../controllers/operatorServices/operations/getSPAList");
const getWebPropertyList = require("../controllers/deprecated/webProperties/getWebPropertyList");
const getAliasList = require("../controllers/operatorServices/operations/getAliasList");
const gitOperations = require("../controllers/deprecated/webProperties/gitOperations");
const saveAlias = require("../controllers/operatorServices/operations/saveAlias");
const getPropertyList = require("../controllers/operatorServices/operations/getPropertyList");

const router = new Router();

router.post("/", gitOperations);

router.get("/list", getWebPropertyList.getWebPropertyList);

router.get("/getspalist/:webPropertyName", getSPAList.getSPAList);

router.post("/analyze/repository", analyzeRepository);

router.get("/activities/:id", produceEvent);

router.post("/alias", saveAlias);

router.get("/alias/list", getAliasList);

router.get("/alias/list/:propertyName", getAliasList);

router.get("/get/applications", getPropertyList.getPropertyList);

router.get("/get/applications/:propertyName", getPropertyList.getPropertyList);

router.get("/get/applications/:propertyName/:spaName", getPropertyList.getPropertyList);

module.exports = router;
