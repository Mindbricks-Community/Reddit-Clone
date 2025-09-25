const utils = require("./utils");

module.exports = {
  createSystemMetric: utils.createSystemMetric,
  getIdListOfSystemMetricByField: utils.getIdListOfSystemMetricByField,
  getSystemMetricById: utils.getSystemMetricById,
  getSystemMetricAggById: utils.getSystemMetricAggById,
  getSystemMetricListByQuery: utils.getSystemMetricListByQuery,
  getSystemMetricStatsByQuery: utils.getSystemMetricStatsByQuery,
  getSystemMetricByQuery: utils.getSystemMetricByQuery,
  updateSystemMetricById: utils.updateSystemMetricById,
  updateSystemMetricByIdList: utils.updateSystemMetricByIdList,
  updateSystemMetricByQuery: utils.updateSystemMetricByQuery,
  deleteSystemMetricById: utils.deleteSystemMetricById,
  deleteSystemMetricByQuery: utils.deleteSystemMetricByQuery,
};
