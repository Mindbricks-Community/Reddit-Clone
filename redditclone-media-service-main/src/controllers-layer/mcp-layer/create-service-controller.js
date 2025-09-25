const MediaServiceMcpController = require("./MediaServiceMcpController");

module.exports = (name, routeName, params) => {
  const mcpController = new MediaServiceMcpController(name, routeName, params);
  return mcpController;
};
