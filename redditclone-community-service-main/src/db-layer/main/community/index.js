const utils = require("./utils");

module.exports = {
  dbGetCommunity: require("./dbGetCommunity"),
  dbCreateCommunity: require("./dbCreateCommunity"),
  dbUpdateCommunity: require("./dbUpdateCommunity"),
  dbDeleteCommunity: require("./dbDeleteCommunity"),
  dbListCommunities: require("./dbListCommunities"),
  createCommunity: utils.createCommunity,
  getIdListOfCommunityByField: utils.getIdListOfCommunityByField,
  getCommunityById: utils.getCommunityById,
  getCommunityAggById: utils.getCommunityAggById,
  getCommunityListByQuery: utils.getCommunityListByQuery,
  getCommunityStatsByQuery: utils.getCommunityStatsByQuery,
  getCommunityByQuery: utils.getCommunityByQuery,
  updateCommunityById: utils.updateCommunityById,
  updateCommunityByIdList: utils.updateCommunityByIdList,
  updateCommunityByQuery: utils.updateCommunityByQuery,
  deleteCommunityById: utils.deleteCommunityById,
  deleteCommunityByQuery: utils.deleteCommunityByQuery,
  getCommunityBySlug: utils.getCommunityBySlug,
};
