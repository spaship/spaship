process.env.SPASHIP_WEBROOT = "/var/www/html";
process.env.SPASHIP_ROUTER_PORT = "8086";
process.env.SPASHIP_TARGET = "http://localhost:8080";
process.env.SPASHIP_LOG_LEVEL = "debug";

module.exports = {
  projects: ["<rootDir>"],
  collectCoverage: true,
  testEnvironment: "node",
};
