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
 * Add a apiKey
 */
router.post("/", apiKey.post);

/**
 * Delete a apiKey
 */
router.delete("/{name}", apiKey.delete);

module.exports = router;
