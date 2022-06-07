const alias = require("../../../models/alias");
const deploymentConnection = require("../../../models/deploymentConnection");
const deploymentRecord = require("../../../models/deploymentRecord");

module.exports = async function getDeploymentRecordList(req, res, next) {
  try {
    /*if (req?.params.name)
      return res.status(200).json(await deploymentRecord.findOne({ propertyName: req.params.name }));
    else return res.status(200).json(await deploymentRecord.find());*/
    const aliasDeploymentConnectionType = "prod";
    const aliasDeploymentRecord = await deploymentRecord.findOne({
      propertyName: req.params.name,
      type: aliasDeploymentConnectionType,
    });
    console.log("Alias Deployment Record");
    console.log(aliasDeploymentRecord);
    if (aliasDeploymentRecord) {
      deploymentBasePath = aliasDeploymentRecord.baseurl;
    } else {
      /**
       * Last added record of same type data (deployment record)
       * Fetch record from deployment collection in sorted order
       * Check the next after record of the env type
       * map it to the property
       **/

      /**
       * TestCase
       *
       * */
      const latestDeploymentRecord = await deploymentRecord.findOne(
        { type: aliasDeploymentConnectionType },
        {},
        { sort: { createdAt: -1 } }
      );

      const deploymentConnectionsResult = await await deploymentConnection.find(
        { type: aliasDeploymentConnectionType },
        {},
        { sort: { createdAt: 1 } }
      );

      if (latestDeploymentRecord == null && deploymentConnectionsResult == null) {
        return "Error";
      }

      if (latestDeploymentRecord == null || deploymentConnectionsResult.length === 1) {
        return res.status(200).json(deploymentConnectionsResult[0]);
      }

      console.log("Lastest deployment zone");
      // console.log(latestDeploymentRecord.deploymentConnectionName);
      // const latestDCName = latestDeploymentRecord.deploymentConnectionName;

      let assignDc;
      for (let i in deploymentConnectionsResult) {
        console.log("checking " + deploymentConnectionsResult[i].name);
        console.log("index" + i);
        if (deploymentConnectionsResult[i].name == latestDCName) {
          if (i == deploymentConnectionsResult.length - 1) {
            assignDc = deploymentConnectionsResult[0];
          } else {
            const nextIndex = ++i;
            assignDc = deploymentConnectionsResult[nextIndex];
          }
          break;
        }
      }

      console.log("Deployment Connections");
      console.log(assignDc);
      return res.status(200).json(assignDc);
    }
    res.status(200).json(aliasDeploymentRecord);
  } catch (err) {
    next(err);
  }
};
