const { Router } = require("express");

const applications = require("./applications");
const apiKeys = require("./apiKeys");

const router = new Router();

const v1 = new Router();
v1.use("/applications", applications);
v1.use("/apiKeys", apiKeys);

router.use("/v1", v1);

module.exports = router;
