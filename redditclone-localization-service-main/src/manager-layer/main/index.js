module.exports = {
  // main Database Crud Object Routes Manager Layer Classes
  // Locale Db Object
  GetLocaleManager: require("./locale/get-locale"),
  CreateLocaleManager: require("./locale/create-locale"),
  UpdateLocaleManager: require("./locale/update-locale"),
  DeleteLocaleManager: require("./locale/delete-locale"),
  ListLocalesManager: require("./locale/list-locales"),
  // LocalizationKey Db Object
  GetLocalizationKeyManager: require("./localizationKey/get-localizationkey"),
  CreateLocalizationKeyManager: require("./localizationKey/create-localizationkey"),
  UpdateLocalizationKeyManager: require("./localizationKey/update-localizationkey"),
  DeleteLocalizationKeyManager: require("./localizationKey/delete-localizationkey"),
  ListLocalizationKeysManager: require("./localizationKey/list-localizationkeys"),
  // LocalizationString Db Object
  GetLocalizationStringManager: require("./localizationString/get-localizationstring"),
  CreateLocalizationStringManager: require("./localizationString/create-localizationstring"),
  UpdateLocalizationStringManager: require("./localizationString/update-localizationstring"),
  DeleteLocalizationStringManager: require("./localizationString/delete-localizationstring"),
  ListLocalizationStringsManager: require("./localizationString/list-localizationstrings"),
};
