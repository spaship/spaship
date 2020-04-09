const isEmpty = require("lodash/isEmpty");
module.exports = () => {
  return function (req, res, next) {
    const original = res.json;
    res.json = function (data) {
      if (!data.error) {
        const content = { status: "success" };
        if (data.message) {
          content.message = data.message;
          delete data.message;
        }
        if (!isEmpty(data)) {
          content.data = data;
        }
        return original.call(this, content);
      }
      return original.call(this, { status: data.status, message: data.message });
    };
    return next();
  };
};
