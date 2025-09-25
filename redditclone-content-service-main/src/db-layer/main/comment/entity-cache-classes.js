const { EntityCache } = require("common");

class CommentEntityCache extends EntityCache {
  constructor() {
    super("comment", ["postId", "userId", "status"]);
  }

  async getCommentById(commentId) {
    const result = await getEntityFromCache(commentId);
    return result;
  }

  async getComments(input) {
    const query = {};

    const result = await selectEntityFromCache(query);
    return result;
  }
}

module.exports = {
  CommentEntityCache,
};
