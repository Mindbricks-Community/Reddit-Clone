const utils = require("./utils");

module.exports = {
  createAuditLog: utils.createAuditLog,
  getIdListOfAuditLogByField: utils.getIdListOfAuditLogByField,
  getAuditLogById: utils.getAuditLogById,
  getAuditLogAggById: utils.getAuditLogAggById,
  getAuditLogListByQuery: utils.getAuditLogListByQuery,
  getAuditLogStatsByQuery: utils.getAuditLogStatsByQuery,
  getAuditLogByQuery: utils.getAuditLogByQuery,
  updateAuditLogById: utils.updateAuditLogById,
  updateAuditLogByIdList: utils.updateAuditLogByIdList,
  updateAuditLogByQuery: utils.updateAuditLogByQuery,
  deleteAuditLogById: utils.deleteAuditLogById,
  deleteAuditLogByQuery: utils.deleteAuditLogByQuery,
};
