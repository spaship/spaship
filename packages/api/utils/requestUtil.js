const config = require("../config");

module.exports.getUserUUID = (req) => {
  const propName = config.get("auth:keycloak:id_prop");
  return req.user && req.user[propName];
};
