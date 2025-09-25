const utils = require("./utils");

module.exports = {
  dbGetVote: require("./dbGetVote"),
  dbCreateVote: require("./dbCreateVote"),
  dbUpdateVote: require("./dbUpdateVote"),
  dbDeleteVote: require("./dbDeleteVote"),
  dbListVotes: require("./dbListVotes"),
  createVote: utils.createVote,
  getIdListOfVoteByField: utils.getIdListOfVoteByField,
  getVoteById: utils.getVoteById,
  getVoteAggById: utils.getVoteAggById,
  getVoteListByQuery: utils.getVoteListByQuery,
  getVoteStatsByQuery: utils.getVoteStatsByQuery,
  getVoteByQuery: utils.getVoteByQuery,
  updateVoteById: utils.updateVoteById,
  updateVoteByIdList: utils.updateVoteByIdList,
  updateVoteByQuery: utils.updateVoteByQuery,
  deleteVoteById: utils.deleteVoteById,
  deleteVoteByQuery: utils.deleteVoteByQuery,
};
