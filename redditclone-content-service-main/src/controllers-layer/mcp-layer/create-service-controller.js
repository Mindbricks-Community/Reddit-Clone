const ContentServiceMcpController = require("./ContentServiceMcpController");

module.exports = (name, routeName, params) => {
  const mcpController = new ContentServiceMcpController(
    name,
    routeName,
    params,
  );
  return mcpController;
};
