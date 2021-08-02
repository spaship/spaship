const config = require("../config");
const get = require("lodash/get");

module.exports = () => {
  return async (req, res, next) => {
  return next();
    const roles = {
      admin: "spaship-admins",
      user: "spaship-users",
    };
    try {
      const adminGroup = config.get("auth:ldap:admin_group");
      const userGroup = config.get("auth:ldap:user_group");
      if (adminGroup) {
        roles.admin = adminGroup;
      }
      if (userGroup) {
        roles.user = userGroup;
      }
      const usedApiKey = req.user.authType === "apikey" ? true : false;
      const hasAdminAccess = req.user.role && req.user.role.indexOf(roles.admin) >= 0;
      const hasUserAccess = req.user.role && req.user.role.indexOf(roles.user) >= 0;
      if (usedApiKey || hasAdminAccess || hasUserAccess) {
        return next();
      } else {
       // return next();
        res
          .status(401)
          .json({ error: true, status: "fail", message: "Access denied, not a member of the required LDAP group(s)." });
      }
    } catch (error) {
      return next(error);
    }
  };
};
