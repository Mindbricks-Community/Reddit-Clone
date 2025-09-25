const utils = require("./utils");

module.exports = {
  dbGetLocale: require("./dbGetLocale"),
  dbCreateLocale: require("./dbCreateLocale"),
  dbUpdateLocale: require("./dbUpdateLocale"),
  dbDeleteLocale: require("./dbDeleteLocale"),
  dbListLocales: require("./dbListLocales"),
  createLocale: utils.createLocale,
  getIdListOfLocaleByField: utils.getIdListOfLocaleByField,
  getLocaleById: utils.getLocaleById,
  getLocaleAggById: utils.getLocaleAggById,
  getLocaleListByQuery: utils.getLocaleListByQuery,
  getLocaleStatsByQuery: utils.getLocaleStatsByQuery,
  getLocaleByQuery: utils.getLocaleByQuery,
  updateLocaleById: utils.updateLocaleById,
  updateLocaleByIdList: utils.updateLocaleByIdList,
  updateLocaleByQuery: utils.updateLocaleByQuery,
  deleteLocaleById: utils.deleteLocaleById,
  deleteLocaleByQuery: utils.deleteLocaleByQuery,
};
