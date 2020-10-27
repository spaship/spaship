const config = require("../config");

module.exports = () => {
  return async (req, res, next) => {
    const roles = {
      admin: "spaship-admins",
      user: "spaship-users",
    };
    try {
      const propName = config.get("auth:prop");
      if (propName) {
        roles.admin = "spaship-" + propName + "-admins";
        roles.user = "spaship-" + propName + "-users";
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
