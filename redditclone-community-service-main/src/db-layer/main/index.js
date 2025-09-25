const communityFunctions = require("./community");
const communityMemberFunctions = require("./communityMember");
const communityRuleFunctions = require("./communityRule");
const communityPinnedFunctions = require("./communityPinned");
const communityAutomodSettingFunctions = require("./communityAutomodSetting");

module.exports = {
  // main Database
  // Community Db Object
  dbGetCommunity: communityFunctions.dbGetCommunity,
  dbCreateCommunity: communityFunctions.dbCreateCommunity,
  dbUpdateCommunity: communityFunctions.dbUpdateCommunity,
  dbDeleteCommunity: communityFunctions.dbDeleteCommunity,
  dbListCommunities: communityFunctions.dbListCommunities,
  createCommunity: communityFunctions.createCommunity,
  getIdListOfCommunityByField: communityFunctions.getIdListOfCommunityByField,
  getCommunityById: communityFunctions.getCommunityById,
  getCommunityAggById: communityFunctions.getCommunityAggById,
  getCommunityListByQuery: communityFunctions.getCommunityListByQuery,
  getCommunityStatsByQuery: communityFunctions.getCommunityStatsByQuery,
  getCommunityByQuery: communityFunctions.getCommunityByQuery,
  updateCommunityById: communityFunctions.updateCommunityById,
  updateCommunityByIdList: communityFunctions.updateCommunityByIdList,
  updateCommunityByQuery: communityFunctions.updateCommunityByQuery,
  deleteCommunityById: communityFunctions.deleteCommunityById,
  deleteCommunityByQuery: communityFunctions.deleteCommunityByQuery,
  getCommunityBySlug: communityFunctions.getCommunityBySlug,
  // CommunityMember Db Object
  dbGetCommunitymember: communityMemberFunctions.dbGetCommunitymember,
  dbCreateCommunitymember: communityMemberFunctions.dbCreateCommunitymember,
  dbUpdateCommunitymember: communityMemberFunctions.dbUpdateCommunitymember,
  dbDeleteCommunitymember: communityMemberFunctions.dbDeleteCommunitymember,
  dbListCommunitymembers: communityMemberFunctions.dbListCommunitymembers,
  createCommunityMember: communityMemberFunctions.createCommunityMember,
  getIdListOfCommunityMemberByField:
    communityMemberFunctions.getIdListOfCommunityMemberByField,
  getCommunityMemberById: communityMemberFunctions.getCommunityMemberById,
  getCommunityMemberAggById: communityMemberFunctions.getCommunityMemberAggById,
  getCommunityMemberListByQuery:
    communityMemberFunctions.getCommunityMemberListByQuery,
  getCommunityMemberStatsByQuery:
    communityMemberFunctions.getCommunityMemberStatsByQuery,
  getCommunityMemberByQuery: communityMemberFunctions.getCommunityMemberByQuery,
  updateCommunityMemberById: communityMemberFunctions.updateCommunityMemberById,
  updateCommunityMemberByIdList:
    communityMemberFunctions.updateCommunityMemberByIdList,
  updateCommunityMemberByQuery:
    communityMemberFunctions.updateCommunityMemberByQuery,
  deleteCommunityMemberById: communityMemberFunctions.deleteCommunityMemberById,
  deleteCommunityMemberByQuery:
    communityMemberFunctions.deleteCommunityMemberByQuery,
  // CommunityRule Db Object
  dbGetCommunityrule: communityRuleFunctions.dbGetCommunityrule,
  dbCreateCommunityrule: communityRuleFunctions.dbCreateCommunityrule,
  dbUpdateCommunityrule: communityRuleFunctions.dbUpdateCommunityrule,
  dbDeleteCommunityrule: communityRuleFunctions.dbDeleteCommunityrule,
  dbListCommunityrules: communityRuleFunctions.dbListCommunityrules,
  createCommunityRule: communityRuleFunctions.createCommunityRule,
  getIdListOfCommunityRuleByField:
    communityRuleFunctions.getIdListOfCommunityRuleByField,
  getCommunityRuleById: communityRuleFunctions.getCommunityRuleById,
  getCommunityRuleAggById: communityRuleFunctions.getCommunityRuleAggById,
  getCommunityRuleListByQuery:
    communityRuleFunctions.getCommunityRuleListByQuery,
  getCommunityRuleStatsByQuery:
    communityRuleFunctions.getCommunityRuleStatsByQuery,
  getCommunityRuleByQuery: communityRuleFunctions.getCommunityRuleByQuery,
  updateCommunityRuleById: communityRuleFunctions.updateCommunityRuleById,
  updateCommunityRuleByIdList:
    communityRuleFunctions.updateCommunityRuleByIdList,
  updateCommunityRuleByQuery: communityRuleFunctions.updateCommunityRuleByQuery,
  deleteCommunityRuleById: communityRuleFunctions.deleteCommunityRuleById,
  deleteCommunityRuleByQuery: communityRuleFunctions.deleteCommunityRuleByQuery,
  // CommunityPinned Db Object
  dbGetCommunitypinned: communityPinnedFunctions.dbGetCommunitypinned,
  dbCreateCommunitypinned: communityPinnedFunctions.dbCreateCommunitypinned,
  dbUpdateCommunitypinned: communityPinnedFunctions.dbUpdateCommunitypinned,
  dbDeleteCommunitypinned: communityPinnedFunctions.dbDeleteCommunitypinned,
  dbListCommunitypinned: communityPinnedFunctions.dbListCommunitypinned,
  createCommunityPinned: communityPinnedFunctions.createCommunityPinned,
  getIdListOfCommunityPinnedByField:
    communityPinnedFunctions.getIdListOfCommunityPinnedByField,
  getCommunityPinnedById: communityPinnedFunctions.getCommunityPinnedById,
  getCommunityPinnedAggById: communityPinnedFunctions.getCommunityPinnedAggById,
  getCommunityPinnedListByQuery:
    communityPinnedFunctions.getCommunityPinnedListByQuery,
  getCommunityPinnedStatsByQuery:
    communityPinnedFunctions.getCommunityPinnedStatsByQuery,
  getCommunityPinnedByQuery: communityPinnedFunctions.getCommunityPinnedByQuery,
  updateCommunityPinnedById: communityPinnedFunctions.updateCommunityPinnedById,
  updateCommunityPinnedByIdList:
    communityPinnedFunctions.updateCommunityPinnedByIdList,
  updateCommunityPinnedByQuery:
    communityPinnedFunctions.updateCommunityPinnedByQuery,
  deleteCommunityPinnedById: communityPinnedFunctions.deleteCommunityPinnedById,
  deleteCommunityPinnedByQuery:
    communityPinnedFunctions.deleteCommunityPinnedByQuery,
  // CommunityAutomodSetting Db Object
  dbGetCommunityautomodsetting:
    communityAutomodSettingFunctions.dbGetCommunityautomodsetting,
  dbCreateCommunityautomodsetting:
    communityAutomodSettingFunctions.dbCreateCommunityautomodsetting,
  dbUpdateCommunityautomodsetting:
    communityAutomodSettingFunctions.dbUpdateCommunityautomodsetting,
  dbDeleteCommunityautomodsetting:
    communityAutomodSettingFunctions.dbDeleteCommunityautomodsetting,
  dbListCommunityautomodsettings:
    communityAutomodSettingFunctions.dbListCommunityautomodsettings,
  createCommunityAutomodSetting:
    communityAutomodSettingFunctions.createCommunityAutomodSetting,
  getIdListOfCommunityAutomodSettingByField:
    communityAutomodSettingFunctions.getIdListOfCommunityAutomodSettingByField,
  getCommunityAutomodSettingById:
    communityAutomodSettingFunctions.getCommunityAutomodSettingById,
  getCommunityAutomodSettingAggById:
    communityAutomodSettingFunctions.getCommunityAutomodSettingAggById,
  getCommunityAutomodSettingListByQuery:
    communityAutomodSettingFunctions.getCommunityAutomodSettingListByQuery,
  getCommunityAutomodSettingStatsByQuery:
    communityAutomodSettingFunctions.getCommunityAutomodSettingStatsByQuery,
  getCommunityAutomodSettingByQuery:
    communityAutomodSettingFunctions.getCommunityAutomodSettingByQuery,
  updateCommunityAutomodSettingById:
    communityAutomodSettingFunctions.updateCommunityAutomodSettingById,
  updateCommunityAutomodSettingByIdList:
    communityAutomodSettingFunctions.updateCommunityAutomodSettingByIdList,
  updateCommunityAutomodSettingByQuery:
    communityAutomodSettingFunctions.updateCommunityAutomodSettingByQuery,
  deleteCommunityAutomodSettingById:
    communityAutomodSettingFunctions.deleteCommunityAutomodSettingById,
  deleteCommunityAutomodSettingByQuery:
    communityAutomodSettingFunctions.deleteCommunityAutomodSettingByQuery,
};
