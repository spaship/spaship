const ephemeralRecord = require("../../../models/ephemeralRecord");
const { log } = require("@spaship/common/lib/logging/pino");

/*
 * It'll send the list of the ephemeral records 
*/
module.exports = async function getEphList(req, res, next) {
  try {
    const { propertyName } = req?.query;
    if (propertyName) {
      const response = await ephemeralRecord.find({ propertyName: propertyName });
      return res.status(200).json(checkResponse(response));
    }
    const response = await ephemeralRecord.find();
    return res.status(200).json(checkResponse(response));
  } catch (err) {
    log.error(err);
    next(err);
  }
};

function checkResponse(response) {
  if (response.length === 0) {
    return { message: "No data avaliable." };
  }
  return response;
}

