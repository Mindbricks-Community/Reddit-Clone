const utils = require("./utils");

module.exports = {
  dbGetCommunitypinned: require("./dbGetCommunitypinned"),
  dbCreateCommunitypinned: require("./dbCreateCommunitypinned"),
  dbUpdateCommunitypinned: require("./dbUpdateCommunitypinned"),
  dbDeleteCommunitypinned: require("./dbDeleteCommunitypinned"),
  dbListCommunitypinned: require("./dbListCommunitypinned"),
  createCommunityPinned: utils.createCommunityPinned,
  getIdListOfCommunityPinnedByField: utils.getIdListOfCommunityPinnedByField,
  getCommunityPinnedById: utils.getCommunityPinnedById,
  getCommunityPinnedAggById: utils.getCommunityPinnedAggById,
  getCommunityPinnedListByQuery: utils.getCommunityPinnedListByQuery,
  getCommunityPinnedStatsByQuery: utils.getCommunityPinnedStatsByQuery,
  getCommunityPinnedByQuery: utils.getCommunityPinnedByQuery,
  updateCommunityPinnedById: utils.updateCommunityPinnedById,
  updateCommunityPinnedByIdList: utils.updateCommunityPinnedByIdList,
  updateCommunityPinnedByQuery: utils.updateCommunityPinnedByQuery,
  deleteCommunityPinnedById: utils.deleteCommunityPinnedById,
  deleteCommunityPinnedByQuery: utils.deleteCommunityPinnedByQuery,
};
