const utils = require("./utils");

module.exports = {
  createAlert: utils.createAlert,
  getIdListOfAlertByField: utils.getIdListOfAlertByField,
  getAlertById: utils.getAlertById,
  getAlertAggById: utils.getAlertAggById,
  getAlertListByQuery: utils.getAlertListByQuery,
  getAlertStatsByQuery: utils.getAlertStatsByQuery,
  getAlertByQuery: utils.getAlertByQuery,
  updateAlertById: utils.updateAlertById,
  updateAlertByIdList: utils.updateAlertByIdList,
  updateAlertByQuery: utils.updateAlertByQuery,
  deleteAlertById: utils.deleteAlertById,
  deleteAlertByQuery: utils.deleteAlertByQuery,
};
