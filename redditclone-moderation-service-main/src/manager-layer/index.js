module.exports = {
  ModerationServiceManager: require("./service-manager/ModerationServiceManager"),
  // main Database Crud Object Routes Manager Layer Classes
  // ModerationAction Db Object
  GetModerationActionManager: require("./main/moderationAction/get-moderationaction"),
  CreateModerationActionManager: require("./main/moderationAction/create-moderationaction"),
  UpdateModerationActionManager: require("./main/moderationAction/update-moderationaction"),
  DeleteModerationActionManager: require("./main/moderationAction/delete-moderationaction"),
  ListModerationActionsManager: require("./main/moderationAction/list-moderationactions"),
  // AutomodEvent Db Object
  GetAutomodEventManager: require("./main/automodEvent/get-automodevent"),
  CreateAutomodEventManager: require("./main/automodEvent/create-automodevent"),
  UpdateAutomodEventManager: require("./main/automodEvent/update-automodevent"),
  DeleteAutomodEventManager: require("./main/automodEvent/delete-automodevent"),
  ListAutomodEventsManager: require("./main/automodEvent/list-automodevents"),
  // ModerationAuditLog Db Object
  GetModerationAuditLogManager: require("./main/moderationAuditLog/get-moderationauditlog"),
  CreateModerationAuditLogManager: require("./main/moderationAuditLog/create-moderationauditlog"),
  UpdateModerationAuditLogManager: require("./main/moderationAuditLog/update-moderationauditlog"),
  DeleteModerationAuditLogManager: require("./main/moderationAuditLog/delete-moderationauditlog"),
  ListModerationAuditLogsManager: require("./main/moderationAuditLog/list-moderationauditlogs"),
  // ModmailThread Db Object
  GetModmailThreadManager: require("./main/modmailThread/get-modmailthread"),
  CreateModmailThreadManager: require("./main/modmailThread/create-modmailthread"),
  UpdateModmailThreadManager: require("./main/modmailThread/update-modmailthread"),
  DeleteModmailThreadManager: require("./main/modmailThread/delete-modmailthread"),
  ListModmailThreadsManager: require("./main/modmailThread/list-modmailthreads"),
  // ModmailMessage Db Object
  GetModmailMessageManager: require("./main/modmailMessage/get-modmailmessage"),
  CreateModmailMessageManager: require("./main/modmailMessage/create-modmailmessage"),
  UpdateModmailMessageManager: require("./main/modmailMessage/update-modmailmessage"),
  DeleteModmailMessageManager: require("./main/modmailMessage/delete-modmailmessage"),
  ListModmailMessagesManager: require("./main/modmailMessage/list-modmailmessages"),
};
