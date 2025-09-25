const { DataTypes } = require("sequelize");
const { getEnumValue } = require("serviceCommon");
const { ElasticIndexer } = require("serviceCommon");
const updateElasticIndexMappings = require("./elastic-index");
const { hexaLogger } = require("common");

const ModerationAction = require("./moderationAction");
const AutomodEvent = require("./automodEvent");
const ModerationAuditLog = require("./moderationAuditLog");
const ModmailThread = require("./modmailThread");
const ModmailMessage = require("./modmailMessage");

ModerationAction.prototype.getData = function () {
  const data = this.dataValues;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  // set enum Index and enum value
  const targetTypeOptions = ["post", "comment", "user"];
  const dataTypetargetTypeModerationAction = typeof data.targetType;
  const enumIndextargetTypeModerationAction =
    dataTypetargetTypeModerationAction === "string"
      ? targetTypeOptions.indexOf(data.targetType)
      : data.targetType;
  data.targetType_idx = enumIndextargetTypeModerationAction;
  data.targetType =
    enumIndextargetTypeModerationAction > -1
      ? targetTypeOptions[enumIndextargetTypeModerationAction]
      : undefined;
  // set enum Index and enum value
  const actionTypeOptions = [
    "approve",
    "remove",
    "lock",
    "unlock",
    "warn",
    "tempBan",
    "permBan",
    "unban",
    "bulkRemove",
    "bulkApprove",
    "note",
  ];
  const dataTypeactionTypeModerationAction = typeof data.actionType;
  const enumIndexactionTypeModerationAction =
    dataTypeactionTypeModerationAction === "string"
      ? actionTypeOptions.indexOf(data.actionType)
      : data.actionType;
  data.actionType_idx = enumIndexactionTypeModerationAction;
  data.actionType =
    enumIndexactionTypeModerationAction > -1
      ? actionTypeOptions[enumIndexactionTypeModerationAction]
      : undefined;
  // set enum Index and enum value
  const performedByRoleOptions = ["moderator", "admin"];
  const dataTypeperformedByRoleModerationAction = typeof data.performedByRole;
  const enumIndexperformedByRoleModerationAction =
    dataTypeperformedByRoleModerationAction === "string"
      ? performedByRoleOptions.indexOf(data.performedByRole)
      : data.performedByRole;
  data.performedByRole_idx = enumIndexperformedByRoleModerationAction;
  data.performedByRole =
    enumIndexperformedByRoleModerationAction > -1
      ? performedByRoleOptions[enumIndexperformedByRoleModerationAction]
      : undefined;

  return data;
};

AutomodEvent.prototype.getData = function () {
  const data = this.dataValues;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  // set enum Index and enum value
  const targetTypeOptions = ["post", "comment"];
  const dataTypetargetTypeAutomodEvent = typeof data.targetType;
  const enumIndextargetTypeAutomodEvent =
    dataTypetargetTypeAutomodEvent === "string"
      ? targetTypeOptions.indexOf(data.targetType)
      : data.targetType;
  data.targetType_idx = enumIndextargetTypeAutomodEvent;
  data.targetType =
    enumIndextargetTypeAutomodEvent > -1
      ? targetTypeOptions[enumIndextargetTypeAutomodEvent]
      : undefined;
  // set enum Index and enum value
  const automodTypeOptions = [
    "trigger",
    "autoRemove",
    "autoLock",
    "flagNsfw",
    "filter",
    "rateLimit",
    "spamDetect",
    "mediaFlag",
    "custom",
  ];
  const dataTypeautomodTypeAutomodEvent = typeof data.automodType;
  const enumIndexautomodTypeAutomodEvent =
    dataTypeautomodTypeAutomodEvent === "string"
      ? automodTypeOptions.indexOf(data.automodType)
      : data.automodType;
  data.automodType_idx = enumIndexautomodTypeAutomodEvent;
  data.automodType =
    enumIndexautomodTypeAutomodEvent > -1
      ? automodTypeOptions[enumIndexautomodTypeAutomodEvent]
      : undefined;

  return data;
};

ModerationAuditLog.prototype.getData = function () {
  const data = this.dataValues;

  data.moderationAction = this.moderationAction
    ? this.moderationAction.getData()
    : undefined;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  // set enum Index and enum value
  const logEntryTypeOptions = [
    "moderationAction",
    "automodEvent",
    "reportLinked",
    "bulkAction",
  ];
  const dataTypelogEntryTypeModerationAuditLog = typeof data.logEntryType;
  const enumIndexlogEntryTypeModerationAuditLog =
    dataTypelogEntryTypeModerationAuditLog === "string"
      ? logEntryTypeOptions.indexOf(data.logEntryType)
      : data.logEntryType;
  data.logEntryType_idx = enumIndexlogEntryTypeModerationAuditLog;
  data.logEntryType =
    enumIndexlogEntryTypeModerationAuditLog > -1
      ? logEntryTypeOptions[enumIndexlogEntryTypeModerationAuditLog]
      : undefined;
  // set enum Index and enum value
  const entityTypeOptions = ["post", "comment", "user", "other"];
  const dataTypeentityTypeModerationAuditLog = typeof data.entityType;
  const enumIndexentityTypeModerationAuditLog =
    dataTypeentityTypeModerationAuditLog === "string"
      ? entityTypeOptions.indexOf(data.entityType)
      : data.entityType;
  data.entityType_idx = enumIndexentityTypeModerationAuditLog;
  data.entityType =
    enumIndexentityTypeModerationAuditLog > -1
      ? entityTypeOptions[enumIndexentityTypeModerationAuditLog]
      : undefined;

  return data;
};

ModerationAuditLog.belongsTo(ModerationAction, {
  as: "moderationAction",
  foreignKey: "linkedModerationActionId",
  targetKey: "id",
  constraints: false,
});

ModmailThread.prototype.getData = function () {
  const data = this.dataValues;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  // set enum Index and enum value
  const statusOptions = ["open", "resolved", "archived", "deleted"];
  const dataTypestatusModmailThread = typeof data.status;
  const enumIndexstatusModmailThread =
    dataTypestatusModmailThread === "string"
      ? statusOptions.indexOf(data.status)
      : data.status;
  data.status_idx = enumIndexstatusModmailThread;
  data.status =
    enumIndexstatusModmailThread > -1
      ? statusOptions[enumIndexstatusModmailThread]
      : undefined;

  return data;
};

ModmailMessage.prototype.getData = function () {
  const data = this.dataValues;

  data.modmailThread = this.modmailThread
    ? this.modmailThread.getData()
    : undefined;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  // set enum Index and enum value
  const messageTypeOptions = ["user", "moderator", "system"];
  const dataTypemessageTypeModmailMessage = typeof data.messageType;
  const enumIndexmessageTypeModmailMessage =
    dataTypemessageTypeModmailMessage === "string"
      ? messageTypeOptions.indexOf(data.messageType)
      : data.messageType;
  data.messageType_idx = enumIndexmessageTypeModmailMessage;
  data.messageType =
    enumIndexmessageTypeModmailMessage > -1
      ? messageTypeOptions[enumIndexmessageTypeModmailMessage]
      : undefined;

  return data;
};

ModmailMessage.belongsTo(ModmailThread, {
  as: "modmailThread",
  foreignKey: "threadId",
  targetKey: "id",
  constraints: false,
});

module.exports = {
  ModerationAction,
  AutomodEvent,
  ModerationAuditLog,
  ModmailThread,
  ModmailMessage,
  updateElasticIndexMappings,
};
