const LocalizationServiceMcpController = require("./LocalizationServiceMcpController");

module.exports = (name, routeName, params) => {
  const mcpController = new LocalizationServiceMcpController(
    name,
    routeName,
    params,
  );
  return mcpController;
};
