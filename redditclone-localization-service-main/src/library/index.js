module.exports = {
  exportTranslations: require("./functions/exportTranslations.js"),
  afterLocalizationStringWrite: require("./hooks/afterLocalizationStringWrite.js"),
  ...require("./templates"),
};
