const utils = require("./utils");

module.exports = {
  dbGetPost: require("./dbGetPost"),
  dbCreatePost: require("./dbCreatePost"),
  dbUpdatePost: require("./dbUpdatePost"),
  dbDeletePost: require("./dbDeletePost"),
  dbListPosts: require("./dbListPosts"),
  createPost: utils.createPost,
  getIdListOfPostByField: utils.getIdListOfPostByField,
  getPostById: utils.getPostById,
  getPostAggById: utils.getPostAggById,
  getPostListByQuery: utils.getPostListByQuery,
  getPostStatsByQuery: utils.getPostStatsByQuery,
  getPostByQuery: utils.getPostByQuery,
  updatePostById: utils.updatePostById,
  updatePostByIdList: utils.updatePostByIdList,
  updatePostByQuery: utils.updatePostByQuery,
  deletePostById: utils.deletePostById,
  deletePostByQuery: utils.deletePostByQuery,
};
