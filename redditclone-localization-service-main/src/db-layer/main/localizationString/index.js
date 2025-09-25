const utils = require("./utils");

module.exports = {
  dbGetLocalizationstring: require("./dbGetLocalizationstring"),
  dbCreateLocalizationstring: require("./dbCreateLocalizationstring"),
  dbUpdateLocalizationstring: require("./dbUpdateLocalizationstring"),
  dbDeleteLocalizationstring: require("./dbDeleteLocalizationstring"),
  dbListLocalizationstrings: require("./dbListLocalizationstrings"),
  createLocalizationString: utils.createLocalizationString,
  getIdListOfLocalizationStringByField:
    utils.getIdListOfLocalizationStringByField,
  getLocalizationStringById: utils.getLocalizationStringById,
  getLocalizationStringAggById: utils.getLocalizationStringAggById,
  getLocalizationStringListByQuery: utils.getLocalizationStringListByQuery,
  getLocalizationStringStatsByQuery: utils.getLocalizationStringStatsByQuery,
  getLocalizationStringByQuery: utils.getLocalizationStringByQuery,
  updateLocalizationStringById: utils.updateLocalizationStringById,
  updateLocalizationStringByIdList: utils.updateLocalizationStringByIdList,
  updateLocalizationStringByQuery: utils.updateLocalizationStringByQuery,
  deleteLocalizationStringById: utils.deleteLocalizationStringById,
  deleteLocalizationStringByQuery: utils.deleteLocalizationStringByQuery,
};
