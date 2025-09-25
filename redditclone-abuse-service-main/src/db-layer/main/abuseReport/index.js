const utils = require("./utils");

module.exports = {
  dbGetAbusereport: require("./dbGetAbusereport"),
  dbCreateAbusereport: require("./dbCreateAbusereport"),
  dbUpdateAbusereport: require("./dbUpdateAbusereport"),
  dbDeleteAbusereport: require("./dbDeleteAbusereport"),
  dbListAbusereports: require("./dbListAbusereports"),
  createAbuseReport: utils.createAbuseReport,
  getIdListOfAbuseReportByField: utils.getIdListOfAbuseReportByField,
  getAbuseReportById: utils.getAbuseReportById,
  getAbuseReportAggById: utils.getAbuseReportAggById,
  getAbuseReportListByQuery: utils.getAbuseReportListByQuery,
  getAbuseReportStatsByQuery: utils.getAbuseReportStatsByQuery,
  getAbuseReportByQuery: utils.getAbuseReportByQuery,
  updateAbuseReportById: utils.updateAbuseReportById,
  updateAbuseReportByIdList: utils.updateAbuseReportByIdList,
  updateAbuseReportByQuery: utils.updateAbuseReportByQuery,
  deleteAbuseReportById: utils.deleteAbuseReportById,
  deleteAbuseReportByQuery: utils.deleteAbuseReportByQuery,
};
