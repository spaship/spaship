const { Router } = require("express");
const application = require("../controllers/application");
const upload = require("../utils/multerUtil");

const router = new Router();

/**
 * Get all applications
 * @return [application] application array
 *
 */
router.get("/", application.list);

/**
 * Get application by name
 */
router.get("/:name", application.get);

/**
 * Add an application
 */
router.post("/", application.post);

/**
 * Deploy an application
 */
router.post("/deploy", upload.single("upload"), application.deploy);

/**
 * Update an application by name
 */
router.put("/:name", application.put);

/**
 * Delete a application
 */
router.delete("/:name", application.delete);

module.exports = router;
