module.exports = (headers) => {
  // main Database Crud Object Mcp Api Routers
  return {
    adminUserActionMcpRouter: require("./adminUserAction")(headers),
    gdprExportRequestMcpRouter: require("./gdprExportRequest")(headers),
    gdprDeleteRequestMcpRouter: require("./gdprDeleteRequest")(headers),
    compliancePolicyMcpRouter: require("./compliancePolicy")(headers),
    globalUserRestrictionMcpRouter: require("./globalUserRestriction")(headers),
  };
};
