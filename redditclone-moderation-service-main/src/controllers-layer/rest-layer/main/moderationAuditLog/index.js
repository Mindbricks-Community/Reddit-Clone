const express = require("express");

// ModerationAuditLog Db Object Rest Api Router
const moderationAuditLogRouter = express.Router();

// add ModerationAuditLog controllers

// getModerationAuditLog controller
moderationAuditLogRouter.get(
  "/moderationauditlogs/:moderationAuditLogId",
  require("./get-moderationauditlog"),
);
// createModerationAuditLog controller
moderationAuditLogRouter.post(
  "/moderationauditlogs",
  require("./create-moderationauditlog"),
);
// updateModerationAuditLog controller
moderationAuditLogRouter.patch(
  "/moderationauditlogs/:moderationAuditLogId",
  require("./update-moderationauditlog"),
);
// deleteModerationAuditLog controller
moderationAuditLogRouter.delete(
  "/moderationauditlogs/:moderationAuditLogId",
  require("./delete-moderationauditlog"),
);
// listModerationAuditLogs controller
moderationAuditLogRouter.get(
  "/moderationauditlogs",
  require("./list-moderationauditlogs"),
);

module.exports = moderationAuditLogRouter;
