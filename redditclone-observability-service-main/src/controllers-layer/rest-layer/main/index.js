module.exports = {
  // main Database Crud Object Rest Api Routers
  systemMetricRouter: require("./systemMetric"),
  errorLogRouter: require("./errorLog"),
  sloEventRouter: require("./sloEvent"),
  auditLogRouter: require("./auditLog"),
  alertRouter: require("./alert"),
};
