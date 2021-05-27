process.env.SPASHIP_WEBROOT = "/var/www/spaship";
process.env.SPASHIP_ROUTER_PORT = "8086";
process.env.SPASHIP_TARGET = "http://localhost:3333";
process.env.SPASHIP_LOG_LEVEL = "debug";

module.exports = {
  projects: ["<rootDir>"],
  collectCoverage: true,
  testEnvironment: "node",
};
