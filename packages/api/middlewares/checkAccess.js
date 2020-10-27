const config = require("../config");

module.exports = () => {
  return async (req, res, next) => {
    try {
      const propName = config.get("auth:role_prop");
      const hasAccess = req.user.role.indexOf(propName) >= 0;
      console.log(hasAccess);
      if (hasAccess) {
        console.log("In");
        return next();
      } else {
        res.status(401).json([]);
      }
    } catch (error) {
      return next(error);
    }
  };
};
