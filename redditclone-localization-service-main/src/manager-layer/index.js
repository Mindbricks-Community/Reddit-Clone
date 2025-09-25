module.exports = {
  LocalizationServiceManager: require("./service-manager/LocalizationServiceManager"),
  // main Database Crud Object Routes Manager Layer Classes
  // Locale Db Object
  GetLocaleManager: require("./main/locale/get-locale"),
  CreateLocaleManager: require("./main/locale/create-locale"),
  UpdateLocaleManager: require("./main/locale/update-locale"),
  DeleteLocaleManager: require("./main/locale/delete-locale"),
  ListLocalesManager: require("./main/locale/list-locales"),
  // LocalizationKey Db Object
  GetLocalizationKeyManager: require("./main/localizationKey/get-localizationkey"),
  CreateLocalizationKeyManager: require("./main/localizationKey/create-localizationkey"),
  UpdateLocalizationKeyManager: require("./main/localizationKey/update-localizationkey"),
  DeleteLocalizationKeyManager: require("./main/localizationKey/delete-localizationkey"),
  ListLocalizationKeysManager: require("./main/localizationKey/list-localizationkeys"),
  // LocalizationString Db Object
  GetLocalizationStringManager: require("./main/localizationString/get-localizationstring"),
  CreateLocalizationStringManager: require("./main/localizationString/create-localizationstring"),
  UpdateLocalizationStringManager: require("./main/localizationString/update-localizationstring"),
  DeleteLocalizationStringManager: require("./main/localizationString/delete-localizationstring"),
  ListLocalizationStringsManager: require("./main/localizationString/list-localizationstrings"),
};
