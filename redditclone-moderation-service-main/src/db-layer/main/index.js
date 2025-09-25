const moderationActionFunctions = require("./moderationAction");
const automodEventFunctions = require("./automodEvent");
const moderationAuditLogFunctions = require("./moderationAuditLog");
const modmailThreadFunctions = require("./modmailThread");
const modmailMessageFunctions = require("./modmailMessage");

module.exports = {
  // main Database
  // ModerationAction Db Object
  dbGetModerationaction: moderationActionFunctions.dbGetModerationaction,
  dbCreateModerationaction: moderationActionFunctions.dbCreateModerationaction,
  dbUpdateModerationaction: moderationActionFunctions.dbUpdateModerationaction,
  dbDeleteModerationaction: moderationActionFunctions.dbDeleteModerationaction,
  dbListModerationactions: moderationActionFunctions.dbListModerationactions,
  createModerationAction: moderationActionFunctions.createModerationAction,
  getIdListOfModerationActionByField:
    moderationActionFunctions.getIdListOfModerationActionByField,
  getModerationActionById: moderationActionFunctions.getModerationActionById,
  getModerationActionAggById:
    moderationActionFunctions.getModerationActionAggById,
  getModerationActionListByQuery:
    moderationActionFunctions.getModerationActionListByQuery,
  getModerationActionStatsByQuery:
    moderationActionFunctions.getModerationActionStatsByQuery,
  getModerationActionByQuery:
    moderationActionFunctions.getModerationActionByQuery,
  updateModerationActionById:
    moderationActionFunctions.updateModerationActionById,
  updateModerationActionByIdList:
    moderationActionFunctions.updateModerationActionByIdList,
  updateModerationActionByQuery:
    moderationActionFunctions.updateModerationActionByQuery,
  deleteModerationActionById:
    moderationActionFunctions.deleteModerationActionById,
  deleteModerationActionByQuery:
    moderationActionFunctions.deleteModerationActionByQuery,
  // AutomodEvent Db Object
  dbGetAutomodevent: automodEventFunctions.dbGetAutomodevent,
  dbCreateAutomodevent: automodEventFunctions.dbCreateAutomodevent,
  dbUpdateAutomodevent: automodEventFunctions.dbUpdateAutomodevent,
  dbDeleteAutomodevent: automodEventFunctions.dbDeleteAutomodevent,
  dbListAutomodevents: automodEventFunctions.dbListAutomodevents,
  createAutomodEvent: automodEventFunctions.createAutomodEvent,
  getIdListOfAutomodEventByField:
    automodEventFunctions.getIdListOfAutomodEventByField,
  getAutomodEventById: automodEventFunctions.getAutomodEventById,
  getAutomodEventAggById: automodEventFunctions.getAutomodEventAggById,
  getAutomodEventListByQuery: automodEventFunctions.getAutomodEventListByQuery,
  getAutomodEventStatsByQuery:
    automodEventFunctions.getAutomodEventStatsByQuery,
  getAutomodEventByQuery: automodEventFunctions.getAutomodEventByQuery,
  updateAutomodEventById: automodEventFunctions.updateAutomodEventById,
  updateAutomodEventByIdList: automodEventFunctions.updateAutomodEventByIdList,
  updateAutomodEventByQuery: automodEventFunctions.updateAutomodEventByQuery,
  deleteAutomodEventById: automodEventFunctions.deleteAutomodEventById,
  deleteAutomodEventByQuery: automodEventFunctions.deleteAutomodEventByQuery,
  // ModerationAuditLog Db Object
  dbGetModerationauditlog: moderationAuditLogFunctions.dbGetModerationauditlog,
  dbCreateModerationauditlog:
    moderationAuditLogFunctions.dbCreateModerationauditlog,
  dbUpdateModerationauditlog:
    moderationAuditLogFunctions.dbUpdateModerationauditlog,
  dbDeleteModerationauditlog:
    moderationAuditLogFunctions.dbDeleteModerationauditlog,
  dbListModerationauditlogs:
    moderationAuditLogFunctions.dbListModerationauditlogs,
  createModerationAuditLog:
    moderationAuditLogFunctions.createModerationAuditLog,
  getIdListOfModerationAuditLogByField:
    moderationAuditLogFunctions.getIdListOfModerationAuditLogByField,
  getModerationAuditLogById:
    moderationAuditLogFunctions.getModerationAuditLogById,
  getModerationAuditLogAggById:
    moderationAuditLogFunctions.getModerationAuditLogAggById,
  getModerationAuditLogListByQuery:
    moderationAuditLogFunctions.getModerationAuditLogListByQuery,
  getModerationAuditLogStatsByQuery:
    moderationAuditLogFunctions.getModerationAuditLogStatsByQuery,
  getModerationAuditLogByQuery:
    moderationAuditLogFunctions.getModerationAuditLogByQuery,
  updateModerationAuditLogById:
    moderationAuditLogFunctions.updateModerationAuditLogById,
  updateModerationAuditLogByIdList:
    moderationAuditLogFunctions.updateModerationAuditLogByIdList,
  updateModerationAuditLogByQuery:
    moderationAuditLogFunctions.updateModerationAuditLogByQuery,
  deleteModerationAuditLogById:
    moderationAuditLogFunctions.deleteModerationAuditLogById,
  deleteModerationAuditLogByQuery:
    moderationAuditLogFunctions.deleteModerationAuditLogByQuery,
  // ModmailThread Db Object
  dbGetModmailthread: modmailThreadFunctions.dbGetModmailthread,
  dbCreateModmailthread: modmailThreadFunctions.dbCreateModmailthread,
  dbUpdateModmailthread: modmailThreadFunctions.dbUpdateModmailthread,
  dbDeleteModmailthread: modmailThreadFunctions.dbDeleteModmailthread,
  dbListModmailthreads: modmailThreadFunctions.dbListModmailthreads,
  createModmailThread: modmailThreadFunctions.createModmailThread,
  getIdListOfModmailThreadByField:
    modmailThreadFunctions.getIdListOfModmailThreadByField,
  getModmailThreadById: modmailThreadFunctions.getModmailThreadById,
  getModmailThreadAggById: modmailThreadFunctions.getModmailThreadAggById,
  getModmailThreadListByQuery:
    modmailThreadFunctions.getModmailThreadListByQuery,
  getModmailThreadStatsByQuery:
    modmailThreadFunctions.getModmailThreadStatsByQuery,
  getModmailThreadByQuery: modmailThreadFunctions.getModmailThreadByQuery,
  updateModmailThreadById: modmailThreadFunctions.updateModmailThreadById,
  updateModmailThreadByIdList:
    modmailThreadFunctions.updateModmailThreadByIdList,
  updateModmailThreadByQuery: modmailThreadFunctions.updateModmailThreadByQuery,
  deleteModmailThreadById: modmailThreadFunctions.deleteModmailThreadById,
  deleteModmailThreadByQuery: modmailThreadFunctions.deleteModmailThreadByQuery,
  // ModmailMessage Db Object
  dbGetModmailmessage: modmailMessageFunctions.dbGetModmailmessage,
  dbCreateModmailmessage: modmailMessageFunctions.dbCreateModmailmessage,
  dbUpdateModmailmessage: modmailMessageFunctions.dbUpdateModmailmessage,
  dbDeleteModmailmessage: modmailMessageFunctions.dbDeleteModmailmessage,
  dbListModmailmessages: modmailMessageFunctions.dbListModmailmessages,
  createModmailMessage: modmailMessageFunctions.createModmailMessage,
  getIdListOfModmailMessageByField:
    modmailMessageFunctions.getIdListOfModmailMessageByField,
  getModmailMessageById: modmailMessageFunctions.getModmailMessageById,
  getModmailMessageAggById: modmailMessageFunctions.getModmailMessageAggById,
  getModmailMessageListByQuery:
    modmailMessageFunctions.getModmailMessageListByQuery,
  getModmailMessageStatsByQuery:
    modmailMessageFunctions.getModmailMessageStatsByQuery,
  getModmailMessageByQuery: modmailMessageFunctions.getModmailMessageByQuery,
  updateModmailMessageById: modmailMessageFunctions.updateModmailMessageById,
  updateModmailMessageByIdList:
    modmailMessageFunctions.updateModmailMessageByIdList,
  updateModmailMessageByQuery:
    modmailMessageFunctions.updateModmailMessageByQuery,
  deleteModmailMessageById: modmailMessageFunctions.deleteModmailMessageById,
  deleteModmailMessageByQuery:
    modmailMessageFunctions.deleteModmailMessageByQuery,
};
