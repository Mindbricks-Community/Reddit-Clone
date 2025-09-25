const { EntityCache } = require("common");

class CommunityEntityCache extends EntityCache {
  constructor() {
    super("community", ["name", "slug", "privacyLevel", "isNsfw"]);
  }

  async getCommunityById(communityId) {
    const result = await getEntityFromCache(communityId);
    return result;
  }

  async getCommunitys(input) {
    const query = {};

    const result = await selectEntityFromCache(query);
    return result;
  }
}

module.exports = {
  CommunityEntityCache,
};
