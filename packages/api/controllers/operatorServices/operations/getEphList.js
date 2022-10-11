const ephemeralRecord = require("../../../models/ephemeralRecord");
const application = require("../../../models/application");
const { log } = require("@spaship/common/lib/logging/pino");

/*
 * It'll send the list of the ephemeral records 
*/
module.exports = async function getEphList(req, res, next) {
  try {
    const { propertyName } = req?.query;
    let ephResponse;
    if (propertyName) {
      ephResponse = await ephemeralRecord.find({ propertyName: propertyName, isActive: true });
      spaResponse = await application.find({ propertyName: propertyName });
    }
    else {
      ephResponse = await ephemeralRecord.find({ isActive: true });
      spaResponse = await application.find();
    }
    if (ephResponse.length == 0) return res.status(200).json({ message: "No data avaliable." });
    log.info(`ephemeral preview records : ${JSON.stringify(ephResponse)}`)
    log.info(`active ephemeral envs : ${ephResponse.length}`)
    const finalResponse = [];
    for (let eph of ephResponse) {
      const spaData = await spaResponse.filter(key => key.env === eph.env);
      const data = responseMapper(eph, spaData)
      finalResponse.push(data);
    }
    return res.status(200).json(checkResponse(finalResponse));
  } catch (err) {
    log.error(err);
    next(err);
  }
};

function responseMapper(eph, spaData) {
  return {
    id: eph.id,
    propertyName: eph.propertyName,
    actionEnabled: eph.actionEnabled,
    actionId: eph.propertyName,
    env: eph.env,
    expiresIn: eph.expiresIn,
    createdBy: eph.createdBy,
    isActive: eph.isActive,
    createdAt: eph.createdAt,
    updatedAt: eph.updatedAt,
    createdBy: eph.createdBy,
    spa: spaData
  };
}

function checkResponse(response) {
  if (response.length === 0) {
    log.info(`no active ephemeral env present`);
    return { message: "No data avaliable." };
  }
  return response;
}

