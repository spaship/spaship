const config = require("../config");

module.exports = () => {
  return async (req, res, next) => {
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
      const hasAdminAccess = req.user.role.indexOf(roles.admin) >= 0;
      const hasUserAccess = req.user.role.indexOf(roles.user) >= 0;
      if (hasAdminAccess || hasUserAccess) {
        return next();
      } else {
        res.status(401).json([]);
      }
    } catch (error) {
      return next(error);
    }
  };
};
