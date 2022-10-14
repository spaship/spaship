const { deletePropertyEnvService } = require("../../controllers/operatorServices/operations/deletePropertyEnv");
const { agenda } = require("../../agenda");
const ephemeralRecord = require("../../models/ephemeralRecord");
const { log } = require("@spaship/common/lib/logging/pino");
/*
  Initializing Delete jobs for ephemeral env
*/
const initializeDeleteJobs = async () => {
  log.info("Initializing Delete jobs for ephemeral Environment");
  const DELETE_EPH_ENV = 'DELETE_EPH_ENV'
  agenda.define(DELETE_EPH_ENV, async job => {
    const { propertyName, env, createdBy, type } = job.attrs.data;
    if (!env.includes("ephemeral")) {
      log.info(`Ephemeral Deletion stopped for Props[${propertyName}, ${env}, ${type}, ${createdBy}]`);
      log.info(`Invalid Environment`);
      return;
    }
    log.info(`Deletion aborted for Ephemeral Props [${propertyName}, ${env}, ${type}, ${createdBy}]`);
    try {
      deletePropertyEnvService({ propertyName, env, type, createdBy });
    }
    catch (e) {
      log.error(e);
    }
  });
  log.info("Suceessfully Intialized Delete jobs for Ephemeral Environment");
}

module.exports = {
  initializeDeleteJobs
};
