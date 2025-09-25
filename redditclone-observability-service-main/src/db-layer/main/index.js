const systemMetricFunctions = require("./systemMetric");
const errorLogFunctions = require("./errorLog");
const sloEventFunctions = require("./sloEvent");
const auditLogFunctions = require("./auditLog");
const alertFunctions = require("./alert");

module.exports = {
  // main Database
  // SystemMetric Db Object
  createSystemMetric: systemMetricFunctions.createSystemMetric,
  getIdListOfSystemMetricByField:
    systemMetricFunctions.getIdListOfSystemMetricByField,
  getSystemMetricById: systemMetricFunctions.getSystemMetricById,
  getSystemMetricAggById: systemMetricFunctions.getSystemMetricAggById,
  getSystemMetricListByQuery: systemMetricFunctions.getSystemMetricListByQuery,
  getSystemMetricStatsByQuery:
    systemMetricFunctions.getSystemMetricStatsByQuery,
  getSystemMetricByQuery: systemMetricFunctions.getSystemMetricByQuery,
  updateSystemMetricById: systemMetricFunctions.updateSystemMetricById,
  updateSystemMetricByIdList: systemMetricFunctions.updateSystemMetricByIdList,
  updateSystemMetricByQuery: systemMetricFunctions.updateSystemMetricByQuery,
  deleteSystemMetricById: systemMetricFunctions.deleteSystemMetricById,
  deleteSystemMetricByQuery: systemMetricFunctions.deleteSystemMetricByQuery,
  // ErrorLog Db Object
  createErrorLog: errorLogFunctions.createErrorLog,
  getIdListOfErrorLogByField: errorLogFunctions.getIdListOfErrorLogByField,
  getErrorLogById: errorLogFunctions.getErrorLogById,
  getErrorLogAggById: errorLogFunctions.getErrorLogAggById,
  getErrorLogListByQuery: errorLogFunctions.getErrorLogListByQuery,
  getErrorLogStatsByQuery: errorLogFunctions.getErrorLogStatsByQuery,
  getErrorLogByQuery: errorLogFunctions.getErrorLogByQuery,
  updateErrorLogById: errorLogFunctions.updateErrorLogById,
  updateErrorLogByIdList: errorLogFunctions.updateErrorLogByIdList,
  updateErrorLogByQuery: errorLogFunctions.updateErrorLogByQuery,
  deleteErrorLogById: errorLogFunctions.deleteErrorLogById,
  deleteErrorLogByQuery: errorLogFunctions.deleteErrorLogByQuery,
  // SloEvent Db Object
  createSloEvent: sloEventFunctions.createSloEvent,
  getIdListOfSloEventByField: sloEventFunctions.getIdListOfSloEventByField,
  getSloEventById: sloEventFunctions.getSloEventById,
  getSloEventAggById: sloEventFunctions.getSloEventAggById,
  getSloEventListByQuery: sloEventFunctions.getSloEventListByQuery,
  getSloEventStatsByQuery: sloEventFunctions.getSloEventStatsByQuery,
  getSloEventByQuery: sloEventFunctions.getSloEventByQuery,
  updateSloEventById: sloEventFunctions.updateSloEventById,
  updateSloEventByIdList: sloEventFunctions.updateSloEventByIdList,
  updateSloEventByQuery: sloEventFunctions.updateSloEventByQuery,
  deleteSloEventById: sloEventFunctions.deleteSloEventById,
  deleteSloEventByQuery: sloEventFunctions.deleteSloEventByQuery,
  // AuditLog Db Object
  createAuditLog: auditLogFunctions.createAuditLog,
  getIdListOfAuditLogByField: auditLogFunctions.getIdListOfAuditLogByField,
  getAuditLogById: auditLogFunctions.getAuditLogById,
  getAuditLogAggById: auditLogFunctions.getAuditLogAggById,
  getAuditLogListByQuery: auditLogFunctions.getAuditLogListByQuery,
  getAuditLogStatsByQuery: auditLogFunctions.getAuditLogStatsByQuery,
  getAuditLogByQuery: auditLogFunctions.getAuditLogByQuery,
  updateAuditLogById: auditLogFunctions.updateAuditLogById,
  updateAuditLogByIdList: auditLogFunctions.updateAuditLogByIdList,
  updateAuditLogByQuery: auditLogFunctions.updateAuditLogByQuery,
  deleteAuditLogById: auditLogFunctions.deleteAuditLogById,
  deleteAuditLogByQuery: auditLogFunctions.deleteAuditLogByQuery,
  // Alert Db Object
  createAlert: alertFunctions.createAlert,
  getIdListOfAlertByField: alertFunctions.getIdListOfAlertByField,
  getAlertById: alertFunctions.getAlertById,
  getAlertAggById: alertFunctions.getAlertAggById,
  getAlertListByQuery: alertFunctions.getAlertListByQuery,
  getAlertStatsByQuery: alertFunctions.getAlertStatsByQuery,
  getAlertByQuery: alertFunctions.getAlertByQuery,
  updateAlertById: alertFunctions.updateAlertById,
  updateAlertByIdList: alertFunctions.updateAlertByIdList,
  updateAlertByQuery: alertFunctions.updateAlertByQuery,
  deleteAlertById: alertFunctions.deleteAlertById,
  deleteAlertByQuery: alertFunctions.deleteAlertByQuery,
};
