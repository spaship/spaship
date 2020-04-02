module.exports = () => {
  return function (error, req, res, next) {
    if (error) {
      // Hack for compatible with express-jwt UnauthorizedError
      const statusCode = error.statusCode || (Number.isInteger(error.status) ? error.status : 500);
      const status = !Number.isInteger(error.status) ? error.status || "error" : "fail";
      return res.status(statusCode).json({
        status: status,
        error: error.name,
        message: error.message,
      });
    }
    next();
  };
};
