const AdminOpsServiceMcpController = require("./AdminOpsServiceMcpController");

module.exports = (name, routeName, params) => {
  const mcpController = new AdminOpsServiceMcpController(
    name,
    routeName,
    params,
  );
  return mcpController;
};
