module.exports = () => {
  return function (req, res, next) {
    const original = res.json;
    res.json = function (data) {
      if (!data.error) {
        return original.call(this, { status: "success", data });
      }
      return original.call(this, { status: data.status, message: data.message });
    };
    return next();
  };
};
