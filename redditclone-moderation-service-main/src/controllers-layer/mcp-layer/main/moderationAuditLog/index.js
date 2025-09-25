module.exports = (headers) => {
  // ModerationAuditLog Db Object Rest Api Router
  const moderationAuditLogMcpRouter = [];
  // getModerationAuditLog controller
  moderationAuditLogMcpRouter.push(
    require("./get-moderationauditlog")(headers),
  );
  // createModerationAuditLog controller
  moderationAuditLogMcpRouter.push(
    require("./create-moderationauditlog")(headers),
  );
  // updateModerationAuditLog controller
  moderationAuditLogMcpRouter.push(
    require("./update-moderationauditlog")(headers),
  );
  // deleteModerationAuditLog controller
  moderationAuditLogMcpRouter.push(
    require("./delete-moderationauditlog")(headers),
  );
  // listModerationAuditLogs controller
  moderationAuditLogMcpRouter.push(
    require("./list-moderationauditlogs")(headers),
  );
  return moderationAuditLogMcpRouter;
};
