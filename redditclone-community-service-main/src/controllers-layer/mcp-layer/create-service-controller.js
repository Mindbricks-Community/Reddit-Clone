const CommunityServiceMcpController = require("./CommunityServiceMcpController");

module.exports = (name, routeName, params) => {
  const mcpController = new CommunityServiceMcpController(
    name,
    routeName,
    params,
  );
  return mcpController;
};
