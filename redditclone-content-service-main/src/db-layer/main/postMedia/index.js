const utils = require("./utils");

module.exports = {
  dbGetPostmedia: require("./dbGetPostmedia"),
  dbAddPostmedia: require("./dbAddPostmedia"),
  dbUpdatePostmedia: require("./dbUpdatePostmedia"),
  dbDeletePostmedia: require("./dbDeletePostmedia"),
  dbListPostmedia: require("./dbListPostmedia"),
  createPostMedia: utils.createPostMedia,
  getIdListOfPostMediaByField: utils.getIdListOfPostMediaByField,
  getPostMediaById: utils.getPostMediaById,
  getPostMediaAggById: utils.getPostMediaAggById,
  getPostMediaListByQuery: utils.getPostMediaListByQuery,
  getPostMediaStatsByQuery: utils.getPostMediaStatsByQuery,
  getPostMediaByQuery: utils.getPostMediaByQuery,
  updatePostMediaById: utils.updatePostMediaById,
  updatePostMediaByIdList: utils.updatePostMediaByIdList,
  updatePostMediaByQuery: utils.updatePostMediaByQuery,
  deletePostMediaById: utils.deletePostMediaById,
  deletePostMediaByQuery: utils.deletePostMediaByQuery,
};
