const config = require("../config");

module.exports.getUserUUID = (req) => {
  const propName = config.get("auth:keycloak:id_prop");
  return req.user && req.user[propName];
};

module.exports.checkRole = (req) => {
  const propName = config.get("auth:role_prop");
  const hasAccess = req.user.role.indexOf(propName) > 0;
  return hasAccess;
};
