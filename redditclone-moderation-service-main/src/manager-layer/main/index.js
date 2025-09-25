module.exports = {
  // main Database Crud Object Routes Manager Layer Classes
  // ModerationAction Db Object
  GetModerationActionManager: require("./moderationAction/get-moderationaction"),
  CreateModerationActionManager: require("./moderationAction/create-moderationaction"),
  UpdateModerationActionManager: require("./moderationAction/update-moderationaction"),
  DeleteModerationActionManager: require("./moderationAction/delete-moderationaction"),
  ListModerationActionsManager: require("./moderationAction/list-moderationactions"),
  // AutomodEvent Db Object
  GetAutomodEventManager: require("./automodEvent/get-automodevent"),
  CreateAutomodEventManager: require("./automodEvent/create-automodevent"),
  UpdateAutomodEventManager: require("./automodEvent/update-automodevent"),
  DeleteAutomodEventManager: require("./automodEvent/delete-automodevent"),
  ListAutomodEventsManager: require("./automodEvent/list-automodevents"),
  // ModerationAuditLog Db Object
  GetModerationAuditLogManager: require("./moderationAuditLog/get-moderationauditlog"),
  CreateModerationAuditLogManager: require("./moderationAuditLog/create-moderationauditlog"),
  UpdateModerationAuditLogManager: require("./moderationAuditLog/update-moderationauditlog"),
  DeleteModerationAuditLogManager: require("./moderationAuditLog/delete-moderationauditlog"),
  ListModerationAuditLogsManager: require("./moderationAuditLog/list-moderationauditlogs"),
  // ModmailThread Db Object
  GetModmailThreadManager: require("./modmailThread/get-modmailthread"),
  CreateModmailThreadManager: require("./modmailThread/create-modmailthread"),
  UpdateModmailThreadManager: require("./modmailThread/update-modmailthread"),
  DeleteModmailThreadManager: require("./modmailThread/delete-modmailthread"),
  ListModmailThreadsManager: require("./modmailThread/list-modmailthreads"),
  // ModmailMessage Db Object
  GetModmailMessageManager: require("./modmailMessage/get-modmailmessage"),
  CreateModmailMessageManager: require("./modmailMessage/create-modmailmessage"),
  UpdateModmailMessageManager: require("./modmailMessage/update-modmailmessage"),
  DeleteModmailMessageManager: require("./modmailMessage/delete-modmailmessage"),
  ListModmailMessagesManager: require("./modmailMessage/list-modmailmessages"),
};
