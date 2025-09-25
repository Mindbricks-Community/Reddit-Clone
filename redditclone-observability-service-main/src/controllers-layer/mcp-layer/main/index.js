module.exports = (headers) => {
  // main Database Crud Object Mcp Api Routers
  return {
    systemMetricMcpRouter: require("./systemMetric")(headers),
    errorLogMcpRouter: require("./errorLog")(headers),
    sloEventMcpRouter: require("./sloEvent")(headers),
    auditLogMcpRouter: require("./auditLog")(headers),
    alertMcpRouter: require("./alert")(headers),
  };
};
