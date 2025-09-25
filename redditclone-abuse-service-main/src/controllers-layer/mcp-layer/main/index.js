module.exports = (headers) => {
  // main Database Crud Object Mcp Api Routers
  return {
    abuseReportMcpRouter: require("./abuseReport")(headers),
    abuseFlagMcpRouter: require("./abuseFlag")(headers),
    abuseHeuristicTriggerMcpRouter: require("./abuseHeuristicTrigger")(headers),
    abuseInvestigationMcpRouter: require("./abuseInvestigation")(headers),
  };
};
