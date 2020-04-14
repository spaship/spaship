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
 * Get application
 */
router.get("/:name", application.get);

/**
 * Add a application
 */
router.post("/", application.post);

/**
 * Deploy a application
 */
router.post("/deploy", upload.single("upload"), application.deploy);

/**
 * Delete a application
 */
router.put("/:name", application.put);

/**
 * Delete a application
 */
router.delete("/:name", application.delete);

module.exports = router;
