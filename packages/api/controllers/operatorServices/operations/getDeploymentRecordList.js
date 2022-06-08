const deploymentRecord = require("../../../models/deploymentRecord");

module.exports = async function getDeploymentRecordList(req, res, next) {
  try {
    if (req?.params.name) res.status(200).json(await deploymentRecord.findOne({ propertyName: req.params.name }));
    else res.status(200).json(await deploymentRecord.find());
  } catch (err) {
    next(err);
  }
};
