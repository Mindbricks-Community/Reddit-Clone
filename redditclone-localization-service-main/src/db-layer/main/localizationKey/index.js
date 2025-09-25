const utils = require("./utils");

module.exports = {
  dbGetLocalizationkey: require("./dbGetLocalizationkey"),
  dbCreateLocalizationkey: require("./dbCreateLocalizationkey"),
  dbUpdateLocalizationkey: require("./dbUpdateLocalizationkey"),
  dbDeleteLocalizationkey: require("./dbDeleteLocalizationkey"),
  dbListLocalizationkeys: require("./dbListLocalizationkeys"),
  createLocalizationKey: utils.createLocalizationKey,
  getIdListOfLocalizationKeyByField: utils.getIdListOfLocalizationKeyByField,
  getLocalizationKeyById: utils.getLocalizationKeyById,
  getLocalizationKeyAggById: utils.getLocalizationKeyAggById,
  getLocalizationKeyListByQuery: utils.getLocalizationKeyListByQuery,
  getLocalizationKeyStatsByQuery: utils.getLocalizationKeyStatsByQuery,
  getLocalizationKeyByQuery: utils.getLocalizationKeyByQuery,
  updateLocalizationKeyById: utils.updateLocalizationKeyById,
  updateLocalizationKeyByIdList: utils.updateLocalizationKeyByIdList,
  updateLocalizationKeyByQuery: utils.updateLocalizationKeyByQuery,
  deleteLocalizationKeyById: utils.deleteLocalizationKeyById,
  deleteLocalizationKeyByQuery: utils.deleteLocalizationKeyByQuery,
};
