module.exports = (headers) => {
  // main Database Crud Object Mcp Api Routers
  return {
    moderationActionMcpRouter: require("./moderationAction")(headers),
    automodEventMcpRouter: require("./automodEvent")(headers),
    moderationAuditLogMcpRouter: require("./moderationAuditLog")(headers),
    modmailThreadMcpRouter: require("./modmailThread")(headers),
    modmailMessageMcpRouter: require("./modmailMessage")(headers),
  };
};
