const utils = require("./utils");

module.exports = {
  dbGetCommunityrule: require("./dbGetCommunityrule"),
  dbCreateCommunityrule: require("./dbCreateCommunityrule"),
  dbUpdateCommunityrule: require("./dbUpdateCommunityrule"),
  dbDeleteCommunityrule: require("./dbDeleteCommunityrule"),
  dbListCommunityrules: require("./dbListCommunityrules"),
  createCommunityRule: utils.createCommunityRule,
  getIdListOfCommunityRuleByField: utils.getIdListOfCommunityRuleByField,
  getCommunityRuleById: utils.getCommunityRuleById,
  getCommunityRuleAggById: utils.getCommunityRuleAggById,
  getCommunityRuleListByQuery: utils.getCommunityRuleListByQuery,
  getCommunityRuleStatsByQuery: utils.getCommunityRuleStatsByQuery,
  getCommunityRuleByQuery: utils.getCommunityRuleByQuery,
  updateCommunityRuleById: utils.updateCommunityRuleById,
  updateCommunityRuleByIdList: utils.updateCommunityRuleByIdList,
  updateCommunityRuleByQuery: utils.updateCommunityRuleByQuery,
  deleteCommunityRuleById: utils.deleteCommunityRuleById,
  deleteCommunityRuleByQuery: utils.deleteCommunityRuleByQuery,
};
