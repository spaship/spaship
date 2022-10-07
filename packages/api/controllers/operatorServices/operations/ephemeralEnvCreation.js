const { log } = require("@spaship/common/lib/logging/pino");
const ephemeralRecord = require("../../../models/ephemeralRecord");
const alias = require('../../../models/alias')
const config = require("../../../config");
const { uuid } = require("uuidv4");
/*
 * Saving Ephemeral Record to Collection (default type is operator & it will contain no URL)
 */
module.exports = async function ephemeralEnvCreation(req) {
    const defaultExpiresIn = config.get("cli:eph_ttl");
    const prepord = "preprod"
    const operator = "operator"
    const id = uuid();
    const env = `ephemeral-${id.substring(0, 4)}`;
    const actionId = req.actionId;
    const actionEnabled = (actionId != 'NA') ? true : false;

    const saveEphemeralRecord = new ephemeralRecord({
        propertyName: req.propertyName,
        env: env,
        actionEnabled: actionEnabled,
        actionId: actionId,
        expiresIn: defaultExpiresIn,
        createdBy: req.userId
    });
    await saveEphemeralRecord.save();

    const saveAlias = new alias({
        id: id,
        propertyName: req.propertyName,
        propertyTitle: req.propertyName,
        env: env,
        url: "NA",
        namespace: req.propertyName,
        deploymentConnectionType: prepord,
        type: operator,
        createdBy: req.userId,
        isActive: true
    });
    try {
        return await saveAlias.save();
    }
    catch (e) {
        log.error(e);
    }
}
