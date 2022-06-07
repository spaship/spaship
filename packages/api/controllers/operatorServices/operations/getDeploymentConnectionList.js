const deploymentConnection = require("../../../models/deploymentConnection");

module.exports = async function getDeploymentConnectionList(req, res, next) {
  try {
    if (req?.params.name) res.status(200).json(await deploymentConnection.findOne({ name: req.params.name }));
    else res.status(200).json(await deploymentConnection.find());
  } catch (err) {
    next(err);
  }
};
