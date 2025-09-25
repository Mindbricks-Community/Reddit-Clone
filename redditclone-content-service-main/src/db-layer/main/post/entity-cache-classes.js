const { EntityCache } = require("common");

class PostEntityCache extends EntityCache {
  constructor() {
    super("post", ["communityId", "userId", "status", "isNsfw"]);
  }

  async getPostById(postId) {
    const result = await getEntityFromCache(postId);
    return result;
  }

  async getPosts(input) {
    const query = {};

    const result = await selectEntityFromCache(query);
    return result;
  }
}

module.exports = {
  PostEntityCache,
};
