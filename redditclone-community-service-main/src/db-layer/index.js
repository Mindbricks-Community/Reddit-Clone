const mainFunctions = require("./main");

module.exports = {
  // main Database
  // Community Db Object
  dbGetCommunity: mainFunctions.dbGetCommunity,
  dbCreateCommunity: mainFunctions.dbCreateCommunity,
  dbUpdateCommunity: mainFunctions.dbUpdateCommunity,
  dbDeleteCommunity: mainFunctions.dbDeleteCommunity,
  dbListCommunities: mainFunctions.dbListCommunities,
  createCommunity: mainFunctions.createCommunity,
  getIdListOfCommunityByField: mainFunctions.getIdListOfCommunityByField,
  getCommunityById: mainFunctions.getCommunityById,
  getCommunityAggById: mainFunctions.getCommunityAggById,
  getCommunityListByQuery: mainFunctions.getCommunityListByQuery,
  getCommunityStatsByQuery: mainFunctions.getCommunityStatsByQuery,
  getCommunityByQuery: mainFunctions.getCommunityByQuery,
  updateCommunityById: mainFunctions.updateCommunityById,
  updateCommunityByIdList: mainFunctions.updateCommunityByIdList,
  updateCommunityByQuery: mainFunctions.updateCommunityByQuery,
  deleteCommunityById: mainFunctions.deleteCommunityById,
  deleteCommunityByQuery: mainFunctions.deleteCommunityByQuery,
  getCommunityBySlug: mainFunctions.getCommunityBySlug,
  // CommunityMember Db Object
  dbGetCommunitymember: mainFunctions.dbGetCommunitymember,
  dbCreateCommunitymember: mainFunctions.dbCreateCommunitymember,
  dbUpdateCommunitymember: mainFunctions.dbUpdateCommunitymember,
  dbDeleteCommunitymember: mainFunctions.dbDeleteCommunitymember,
  dbListCommunitymembers: mainFunctions.dbListCommunitymembers,
  createCommunityMember: mainFunctions.createCommunityMember,
  getIdListOfCommunityMemberByField:
    mainFunctions.getIdListOfCommunityMemberByField,
  getCommunityMemberById: mainFunctions.getCommunityMemberById,
  getCommunityMemberAggById: mainFunctions.getCommunityMemberAggById,
  getCommunityMemberListByQuery: mainFunctions.getCommunityMemberListByQuery,
  getCommunityMemberStatsByQuery: mainFunctions.getCommunityMemberStatsByQuery,
  getCommunityMemberByQuery: mainFunctions.getCommunityMemberByQuery,
  updateCommunityMemberById: mainFunctions.updateCommunityMemberById,
  updateCommunityMemberByIdList: mainFunctions.updateCommunityMemberByIdList,
  updateCommunityMemberByQuery: mainFunctions.updateCommunityMemberByQuery,
  deleteCommunityMemberById: mainFunctions.deleteCommunityMemberById,
  deleteCommunityMemberByQuery: mainFunctions.deleteCommunityMemberByQuery,
  // CommunityRule Db Object
  dbGetCommunityrule: mainFunctions.dbGetCommunityrule,
  dbCreateCommunityrule: mainFunctions.dbCreateCommunityrule,
  dbUpdateCommunityrule: mainFunctions.dbUpdateCommunityrule,
  dbDeleteCommunityrule: mainFunctions.dbDeleteCommunityrule,
  dbListCommunityrules: mainFunctions.dbListCommunityrules,
  createCommunityRule: mainFunctions.createCommunityRule,
  getIdListOfCommunityRuleByField:
    mainFunctions.getIdListOfCommunityRuleByField,
  getCommunityRuleById: mainFunctions.getCommunityRuleById,
  getCommunityRuleAggById: mainFunctions.getCommunityRuleAggById,
  getCommunityRuleListByQuery: mainFunctions.getCommunityRuleListByQuery,
  getCommunityRuleStatsByQuery: mainFunctions.getCommunityRuleStatsByQuery,
  getCommunityRuleByQuery: mainFunctions.getCommunityRuleByQuery,
  updateCommunityRuleById: mainFunctions.updateCommunityRuleById,
  updateCommunityRuleByIdList: mainFunctions.updateCommunityRuleByIdList,
  updateCommunityRuleByQuery: mainFunctions.updateCommunityRuleByQuery,
  deleteCommunityRuleById: mainFunctions.deleteCommunityRuleById,
  deleteCommunityRuleByQuery: mainFunctions.deleteCommunityRuleByQuery,
  // CommunityPinned Db Object
  dbGetCommunitypinned: mainFunctions.dbGetCommunitypinned,
  dbCreateCommunitypinned: mainFunctions.dbCreateCommunitypinned,
  dbUpdateCommunitypinned: mainFunctions.dbUpdateCommunitypinned,
  dbDeleteCommunitypinned: mainFunctions.dbDeleteCommunitypinned,
  dbListCommunitypinned: mainFunctions.dbListCommunitypinned,
  createCommunityPinned: mainFunctions.createCommunityPinned,
  getIdListOfCommunityPinnedByField:
    mainFunctions.getIdListOfCommunityPinnedByField,
  getCommunityPinnedById: mainFunctions.getCommunityPinnedById,
  getCommunityPinnedAggById: mainFunctions.getCommunityPinnedAggById,
  getCommunityPinnedListByQuery: mainFunctions.getCommunityPinnedListByQuery,
  getCommunityPinnedStatsByQuery: mainFunctions.getCommunityPinnedStatsByQuery,
  getCommunityPinnedByQuery: mainFunctions.getCommunityPinnedByQuery,
  updateCommunityPinnedById: mainFunctions.updateCommunityPinnedById,
  updateCommunityPinnedByIdList: mainFunctions.updateCommunityPinnedByIdList,
  updateCommunityPinnedByQuery: mainFunctions.updateCommunityPinnedByQuery,
  deleteCommunityPinnedById: mainFunctions.deleteCommunityPinnedById,
  deleteCommunityPinnedByQuery: mainFunctions.deleteCommunityPinnedByQuery,
  // CommunityAutomodSetting Db Object
  dbGetCommunityautomodsetting: mainFunctions.dbGetCommunityautomodsetting,
  dbCreateCommunityautomodsetting:
    mainFunctions.dbCreateCommunityautomodsetting,
  dbUpdateCommunityautomodsetting:
    mainFunctions.dbUpdateCommunityautomodsetting,
  dbDeleteCommunityautomodsetting:
    mainFunctions.dbDeleteCommunityautomodsetting,
  dbListCommunityautomodsettings: mainFunctions.dbListCommunityautomodsettings,
  createCommunityAutomodSetting: mainFunctions.createCommunityAutomodSetting,
  getIdListOfCommunityAutomodSettingByField:
    mainFunctions.getIdListOfCommunityAutomodSettingByField,
  getCommunityAutomodSettingById: mainFunctions.getCommunityAutomodSettingById,
  getCommunityAutomodSettingAggById:
    mainFunctions.getCommunityAutomodSettingAggById,
  getCommunityAutomodSettingListByQuery:
    mainFunctions.getCommunityAutomodSettingListByQuery,
  getCommunityAutomodSettingStatsByQuery:
    mainFunctions.getCommunityAutomodSettingStatsByQuery,
  getCommunityAutomodSettingByQuery:
    mainFunctions.getCommunityAutomodSettingByQuery,
  updateCommunityAutomodSettingById:
    mainFunctions.updateCommunityAutomodSettingById,
  updateCommunityAutomodSettingByIdList:
    mainFunctions.updateCommunityAutomodSettingByIdList,
  updateCommunityAutomodSettingByQuery:
    mainFunctions.updateCommunityAutomodSettingByQuery,
  deleteCommunityAutomodSettingById:
    mainFunctions.deleteCommunityAutomodSettingById,
  deleteCommunityAutomodSettingByQuery:
    mainFunctions.deleteCommunityAutomodSettingByQuery,
};
