const utils = require("./utils");

module.exports = {
  dbGetModerationauditlog: require("./dbGetModerationauditlog"),
  dbCreateModerationauditlog: require("./dbCreateModerationauditlog"),
  dbUpdateModerationauditlog: require("./dbUpdateModerationauditlog"),
  dbDeleteModerationauditlog: require("./dbDeleteModerationauditlog"),
  dbListModerationauditlogs: require("./dbListModerationauditlogs"),
  createModerationAuditLog: utils.createModerationAuditLog,
  getIdListOfModerationAuditLogByField:
    utils.getIdListOfModerationAuditLogByField,
  getModerationAuditLogById: utils.getModerationAuditLogById,
  getModerationAuditLogAggById: utils.getModerationAuditLogAggById,
  getModerationAuditLogListByQuery: utils.getModerationAuditLogListByQuery,
  getModerationAuditLogStatsByQuery: utils.getModerationAuditLogStatsByQuery,
  getModerationAuditLogByQuery: utils.getModerationAuditLogByQuery,
  updateModerationAuditLogById: utils.updateModerationAuditLogById,
  updateModerationAuditLogByIdList: utils.updateModerationAuditLogByIdList,
  updateModerationAuditLogByQuery: utils.updateModerationAuditLogByQuery,
  deleteModerationAuditLogById: utils.deleteModerationAuditLogById,
  deleteModerationAuditLogByQuery: utils.deleteModerationAuditLogByQuery,
};
