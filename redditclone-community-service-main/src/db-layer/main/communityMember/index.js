const utils = require("./utils");

module.exports = {
  dbGetCommunitymember: require("./dbGetCommunitymember"),
  dbCreateCommunitymember: require("./dbCreateCommunitymember"),
  dbUpdateCommunitymember: require("./dbUpdateCommunitymember"),
  dbDeleteCommunitymember: require("./dbDeleteCommunitymember"),
  dbListCommunitymembers: require("./dbListCommunitymembers"),
  createCommunityMember: utils.createCommunityMember,
  getIdListOfCommunityMemberByField: utils.getIdListOfCommunityMemberByField,
  getCommunityMemberById: utils.getCommunityMemberById,
  getCommunityMemberAggById: utils.getCommunityMemberAggById,
  getCommunityMemberListByQuery: utils.getCommunityMemberListByQuery,
  getCommunityMemberStatsByQuery: utils.getCommunityMemberStatsByQuery,
  getCommunityMemberByQuery: utils.getCommunityMemberByQuery,
  updateCommunityMemberById: utils.updateCommunityMemberById,
  updateCommunityMemberByIdList: utils.updateCommunityMemberByIdList,
  updateCommunityMemberByQuery: utils.updateCommunityMemberByQuery,
  deleteCommunityMemberById: utils.deleteCommunityMemberById,
  deleteCommunityMemberByQuery: utils.deleteCommunityMemberByQuery,
};
