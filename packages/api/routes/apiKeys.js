const { Router } = require("express");
const apiKey = require("../controllers/apiKey");

const router = new Router();

/**
 * Get all applications
 * @return [application] application array
 *
 */
router.get("/", apiKey.list);

/**
 * Get all applications
 * @return [application] application array
 *
 */
router.get("/:propertyName", apiKey.propertyList);

/**
 * Add an api key
 */
router.post("/", apiKey.post);

/**
 * Delete an api key
 */
router.delete("/:label/:shortKey", apiKey.delete);

module.exports = router;
