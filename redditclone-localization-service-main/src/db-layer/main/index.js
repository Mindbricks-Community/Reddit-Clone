const localeFunctions = require("./locale");
const localizationKeyFunctions = require("./localizationKey");
const localizationStringFunctions = require("./localizationString");

module.exports = {
  // main Database
  // Locale Db Object
  dbGetLocale: localeFunctions.dbGetLocale,
  dbCreateLocale: localeFunctions.dbCreateLocale,
  dbUpdateLocale: localeFunctions.dbUpdateLocale,
  dbDeleteLocale: localeFunctions.dbDeleteLocale,
  dbListLocales: localeFunctions.dbListLocales,
  createLocale: localeFunctions.createLocale,
  getIdListOfLocaleByField: localeFunctions.getIdListOfLocaleByField,
  getLocaleById: localeFunctions.getLocaleById,
  getLocaleAggById: localeFunctions.getLocaleAggById,
  getLocaleListByQuery: localeFunctions.getLocaleListByQuery,
  getLocaleStatsByQuery: localeFunctions.getLocaleStatsByQuery,
  getLocaleByQuery: localeFunctions.getLocaleByQuery,
  updateLocaleById: localeFunctions.updateLocaleById,
  updateLocaleByIdList: localeFunctions.updateLocaleByIdList,
  updateLocaleByQuery: localeFunctions.updateLocaleByQuery,
  deleteLocaleById: localeFunctions.deleteLocaleById,
  deleteLocaleByQuery: localeFunctions.deleteLocaleByQuery,
  // LocalizationKey Db Object
  dbGetLocalizationkey: localizationKeyFunctions.dbGetLocalizationkey,
  dbCreateLocalizationkey: localizationKeyFunctions.dbCreateLocalizationkey,
  dbUpdateLocalizationkey: localizationKeyFunctions.dbUpdateLocalizationkey,
  dbDeleteLocalizationkey: localizationKeyFunctions.dbDeleteLocalizationkey,
  dbListLocalizationkeys: localizationKeyFunctions.dbListLocalizationkeys,
  createLocalizationKey: localizationKeyFunctions.createLocalizationKey,
  getIdListOfLocalizationKeyByField:
    localizationKeyFunctions.getIdListOfLocalizationKeyByField,
  getLocalizationKeyById: localizationKeyFunctions.getLocalizationKeyById,
  getLocalizationKeyAggById: localizationKeyFunctions.getLocalizationKeyAggById,
  getLocalizationKeyListByQuery:
    localizationKeyFunctions.getLocalizationKeyListByQuery,
  getLocalizationKeyStatsByQuery:
    localizationKeyFunctions.getLocalizationKeyStatsByQuery,
  getLocalizationKeyByQuery: localizationKeyFunctions.getLocalizationKeyByQuery,
  updateLocalizationKeyById: localizationKeyFunctions.updateLocalizationKeyById,
  updateLocalizationKeyByIdList:
    localizationKeyFunctions.updateLocalizationKeyByIdList,
  updateLocalizationKeyByQuery:
    localizationKeyFunctions.updateLocalizationKeyByQuery,
  deleteLocalizationKeyById: localizationKeyFunctions.deleteLocalizationKeyById,
  deleteLocalizationKeyByQuery:
    localizationKeyFunctions.deleteLocalizationKeyByQuery,
  // LocalizationString Db Object
  dbGetLocalizationstring: localizationStringFunctions.dbGetLocalizationstring,
  dbCreateLocalizationstring:
    localizationStringFunctions.dbCreateLocalizationstring,
  dbUpdateLocalizationstring:
    localizationStringFunctions.dbUpdateLocalizationstring,
  dbDeleteLocalizationstring:
    localizationStringFunctions.dbDeleteLocalizationstring,
  dbListLocalizationstrings:
    localizationStringFunctions.dbListLocalizationstrings,
  createLocalizationString:
    localizationStringFunctions.createLocalizationString,
  getIdListOfLocalizationStringByField:
    localizationStringFunctions.getIdListOfLocalizationStringByField,
  getLocalizationStringById:
    localizationStringFunctions.getLocalizationStringById,
  getLocalizationStringAggById:
    localizationStringFunctions.getLocalizationStringAggById,
  getLocalizationStringListByQuery:
    localizationStringFunctions.getLocalizationStringListByQuery,
  getLocalizationStringStatsByQuery:
    localizationStringFunctions.getLocalizationStringStatsByQuery,
  getLocalizationStringByQuery:
    localizationStringFunctions.getLocalizationStringByQuery,
  updateLocalizationStringById:
    localizationStringFunctions.updateLocalizationStringById,
  updateLocalizationStringByIdList:
    localizationStringFunctions.updateLocalizationStringByIdList,
  updateLocalizationStringByQuery:
    localizationStringFunctions.updateLocalizationStringByQuery,
  deleteLocalizationStringById:
    localizationStringFunctions.deleteLocalizationStringById,
  deleteLocalizationStringByQuery:
    localizationStringFunctions.deleteLocalizationStringByQuery,
};
