const mainFunctions = require("./main");

module.exports = {
  // main Database
  // Locale Db Object
  dbGetLocale: mainFunctions.dbGetLocale,
  dbCreateLocale: mainFunctions.dbCreateLocale,
  dbUpdateLocale: mainFunctions.dbUpdateLocale,
  dbDeleteLocale: mainFunctions.dbDeleteLocale,
  dbListLocales: mainFunctions.dbListLocales,
  createLocale: mainFunctions.createLocale,
  getIdListOfLocaleByField: mainFunctions.getIdListOfLocaleByField,
  getLocaleById: mainFunctions.getLocaleById,
  getLocaleAggById: mainFunctions.getLocaleAggById,
  getLocaleListByQuery: mainFunctions.getLocaleListByQuery,
  getLocaleStatsByQuery: mainFunctions.getLocaleStatsByQuery,
  getLocaleByQuery: mainFunctions.getLocaleByQuery,
  updateLocaleById: mainFunctions.updateLocaleById,
  updateLocaleByIdList: mainFunctions.updateLocaleByIdList,
  updateLocaleByQuery: mainFunctions.updateLocaleByQuery,
  deleteLocaleById: mainFunctions.deleteLocaleById,
  deleteLocaleByQuery: mainFunctions.deleteLocaleByQuery,
  // LocalizationKey Db Object
  dbGetLocalizationkey: mainFunctions.dbGetLocalizationkey,
  dbCreateLocalizationkey: mainFunctions.dbCreateLocalizationkey,
  dbUpdateLocalizationkey: mainFunctions.dbUpdateLocalizationkey,
  dbDeleteLocalizationkey: mainFunctions.dbDeleteLocalizationkey,
  dbListLocalizationkeys: mainFunctions.dbListLocalizationkeys,
  createLocalizationKey: mainFunctions.createLocalizationKey,
  getIdListOfLocalizationKeyByField:
    mainFunctions.getIdListOfLocalizationKeyByField,
  getLocalizationKeyById: mainFunctions.getLocalizationKeyById,
  getLocalizationKeyAggById: mainFunctions.getLocalizationKeyAggById,
  getLocalizationKeyListByQuery: mainFunctions.getLocalizationKeyListByQuery,
  getLocalizationKeyStatsByQuery: mainFunctions.getLocalizationKeyStatsByQuery,
  getLocalizationKeyByQuery: mainFunctions.getLocalizationKeyByQuery,
  updateLocalizationKeyById: mainFunctions.updateLocalizationKeyById,
  updateLocalizationKeyByIdList: mainFunctions.updateLocalizationKeyByIdList,
  updateLocalizationKeyByQuery: mainFunctions.updateLocalizationKeyByQuery,
  deleteLocalizationKeyById: mainFunctions.deleteLocalizationKeyById,
  deleteLocalizationKeyByQuery: mainFunctions.deleteLocalizationKeyByQuery,
  // LocalizationString Db Object
  dbGetLocalizationstring: mainFunctions.dbGetLocalizationstring,
  dbCreateLocalizationstring: mainFunctions.dbCreateLocalizationstring,
  dbUpdateLocalizationstring: mainFunctions.dbUpdateLocalizationstring,
  dbDeleteLocalizationstring: mainFunctions.dbDeleteLocalizationstring,
  dbListLocalizationstrings: mainFunctions.dbListLocalizationstrings,
  createLocalizationString: mainFunctions.createLocalizationString,
  getIdListOfLocalizationStringByField:
    mainFunctions.getIdListOfLocalizationStringByField,
  getLocalizationStringById: mainFunctions.getLocalizationStringById,
  getLocalizationStringAggById: mainFunctions.getLocalizationStringAggById,
  getLocalizationStringListByQuery:
    mainFunctions.getLocalizationStringListByQuery,
  getLocalizationStringStatsByQuery:
    mainFunctions.getLocalizationStringStatsByQuery,
  getLocalizationStringByQuery: mainFunctions.getLocalizationStringByQuery,
  updateLocalizationStringById: mainFunctions.updateLocalizationStringById,
  updateLocalizationStringByIdList:
    mainFunctions.updateLocalizationStringByIdList,
  updateLocalizationStringByQuery:
    mainFunctions.updateLocalizationStringByQuery,
  deleteLocalizationStringById: mainFunctions.deleteLocalizationStringById,
  deleteLocalizationStringByQuery:
    mainFunctions.deleteLocalizationStringByQuery,
};
