const utils = require("./utils");

module.exports = {
  dbGetAbuseflag: require("./dbGetAbuseflag"),
  dbCreateAbuseflag: require("./dbCreateAbuseflag"),
  dbUpdateAbuseflag: require("./dbUpdateAbuseflag"),
  dbDeleteAbuseflag: require("./dbDeleteAbuseflag"),
  dbListAbuseflags: require("./dbListAbuseflags"),
  createAbuseFlag: utils.createAbuseFlag,
  getIdListOfAbuseFlagByField: utils.getIdListOfAbuseFlagByField,
  getAbuseFlagById: utils.getAbuseFlagById,
  getAbuseFlagAggById: utils.getAbuseFlagAggById,
  getAbuseFlagListByQuery: utils.getAbuseFlagListByQuery,
  getAbuseFlagStatsByQuery: utils.getAbuseFlagStatsByQuery,
  getAbuseFlagByQuery: utils.getAbuseFlagByQuery,
  updateAbuseFlagById: utils.updateAbuseFlagById,
  updateAbuseFlagByIdList: utils.updateAbuseFlagByIdList,
  updateAbuseFlagByQuery: utils.updateAbuseFlagByQuery,
  deleteAbuseFlagById: utils.deleteAbuseFlagById,
  deleteAbuseFlagByQuery: utils.deleteAbuseFlagByQuery,
};
