const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class CommunityMemberQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("communityMember", [], Op.and, Op.eq, input, wClause);
  }
}
class CommunityMemberQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("communityMember", []);
  }
}

module.exports = {
  CommunityMemberQueryCache,
  CommunityMemberQueryCacheInvalidator,
};
