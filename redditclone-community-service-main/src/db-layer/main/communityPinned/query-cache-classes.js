const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class CommunityPinnedQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("communityPinned", [], Op.and, Op.eq, input, wClause);
  }
}
class CommunityPinnedQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("communityPinned", []);
  }
}

module.exports = {
  CommunityPinnedQueryCache,
  CommunityPinnedQueryCacheInvalidator,
};
