
const ephemeralRecord = require("../../../models/ephemeralRecord");
const { deletePropertyEnvService } = require("./deletePropertyEnv")
const { log } = require("@spaship/common/lib/logging/pino");
const { agenda } = require("../../../agenda");
const config = require("../../../config");

module.exports = async function ephemeralEnvDeletion(req) {
    const ephttl = config.get("cli:eph_ttl");
    const sceduledDate = new Date();
    sceduledDate.setSeconds(sceduledDate.getSeconds() + ephttl);
    const propertyName = req?.propertyName;
    const env = req?.env;
    const type = 'preprod';
    const createdBy = req?.createdBy;

    if (!env.includes("ephemeral")) {
        log.info("Only Ephemeral Env can be deleted, please contact SPAship team");
        throw new ValidationError("Only Ephemeral Env can be deleted, please contact SPAship team")
    }

    log.info(`${propertyName}--${env} will be deleted at ${sceduledDate}`);
    const findEphemeral = await ephemeralRecord.findOne({ propertyName, env, actionEnabled: true, isActive: true });
    if (!findEphemeral?.agendaId) {
        const res = await agenda.schedule(sceduledDate, 'DELETE_EPH_ENV', { propertyName: propertyName, env: env, type: type, createdBy: createdBy });
        const agendaId = res?.attrs?._id?.toString();
        if (agendaId) await ephemeralRecord.updateOne({ propertyName, env }, { agendaId: agendaId });
        log.info(`Deletion successfully scheduled for ${propertyName}--${env}, Ref agendaId - ${agendaId}`);
        return;
    }
    log.info(`Deletion has already been scheduled for ${propertyName}--${env}, Ref agendaId - ${findEphemeral.agendaId}`);
}