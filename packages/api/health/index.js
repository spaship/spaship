const mongoose = require("mongoose");
const liveness = (req, res) => {
  res.json({
    server: "Up",
  });
};

const readiness = (req, res) => {
  const mongoStatusMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  res.json({
    server: "Up",
    database: mongoStatusMap[mongoose.connection.readyState],
  });
};

module.exports = {
  liveness,
  readiness,
};
