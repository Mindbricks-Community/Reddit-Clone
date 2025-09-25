const utils = require("./utils");

module.exports = {
  dbGetCommunityautomodsetting: require("./dbGetCommunityautomodsetting"),
  dbCreateCommunityautomodsetting: require("./dbCreateCommunityautomodsetting"),
  dbUpdateCommunityautomodsetting: require("./dbUpdateCommunityautomodsetting"),
  dbDeleteCommunityautomodsetting: require("./dbDeleteCommunityautomodsetting"),
  dbListCommunityautomodsettings: require("./dbListCommunityautomodsettings"),
  createCommunityAutomodSetting: utils.createCommunityAutomodSetting,
  getIdListOfCommunityAutomodSettingByField:
    utils.getIdListOfCommunityAutomodSettingByField,
  getCommunityAutomodSettingById: utils.getCommunityAutomodSettingById,
  getCommunityAutomodSettingAggById: utils.getCommunityAutomodSettingAggById,
  getCommunityAutomodSettingListByQuery:
    utils.getCommunityAutomodSettingListByQuery,
  getCommunityAutomodSettingStatsByQuery:
    utils.getCommunityAutomodSettingStatsByQuery,
  getCommunityAutomodSettingByQuery: utils.getCommunityAutomodSettingByQuery,
  updateCommunityAutomodSettingById: utils.updateCommunityAutomodSettingById,
  updateCommunityAutomodSettingByIdList:
    utils.updateCommunityAutomodSettingByIdList,
  updateCommunityAutomodSettingByQuery:
    utils.updateCommunityAutomodSettingByQuery,
  deleteCommunityAutomodSettingById: utils.deleteCommunityAutomodSettingById,
  deleteCommunityAutomodSettingByQuery:
    utils.deleteCommunityAutomodSettingByQuery,
};
