const AbuseServiceMcpController = require("./AbuseServiceMcpController");

module.exports = (name, routeName, params) => {
  const mcpController = new AbuseServiceMcpController(name, routeName, params);
  return mcpController;
};
