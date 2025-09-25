const ModerationServiceMcpController = require("./ModerationServiceMcpController");

module.exports = (name, routeName, params) => {
  const mcpController = new ModerationServiceMcpController(
    name,
    routeName,
    params,
  );
  return mcpController;
};
