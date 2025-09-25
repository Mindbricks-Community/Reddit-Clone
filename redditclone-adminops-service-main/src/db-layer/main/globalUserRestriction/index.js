const utils = require("./utils");

module.exports = {
  dbGetGlobaluserrestriction: require("./dbGetGlobaluserrestriction"),
  dbCreateGlobaluserrestriction: require("./dbCreateGlobaluserrestriction"),
  dbUpdateGlobaluserrestriction: require("./dbUpdateGlobaluserrestriction"),
  dbDeleteGlobaluserrestriction: require("./dbDeleteGlobaluserrestriction"),
  dbListGlobaluserrestrictions: require("./dbListGlobaluserrestrictions"),
  createGlobalUserRestriction: utils.createGlobalUserRestriction,
  getIdListOfGlobalUserRestrictionByField:
    utils.getIdListOfGlobalUserRestrictionByField,
  getGlobalUserRestrictionById: utils.getGlobalUserRestrictionById,
  getGlobalUserRestrictionAggById: utils.getGlobalUserRestrictionAggById,
  getGlobalUserRestrictionListByQuery:
    utils.getGlobalUserRestrictionListByQuery,
  getGlobalUserRestrictionStatsByQuery:
    utils.getGlobalUserRestrictionStatsByQuery,
  getGlobalUserRestrictionByQuery: utils.getGlobalUserRestrictionByQuery,
  updateGlobalUserRestrictionById: utils.updateGlobalUserRestrictionById,
  updateGlobalUserRestrictionByIdList:
    utils.updateGlobalUserRestrictionByIdList,
  updateGlobalUserRestrictionByQuery: utils.updateGlobalUserRestrictionByQuery,
  deleteGlobalUserRestrictionById: utils.deleteGlobalUserRestrictionById,
  deleteGlobalUserRestrictionByQuery: utils.deleteGlobalUserRestrictionByQuery,
};
