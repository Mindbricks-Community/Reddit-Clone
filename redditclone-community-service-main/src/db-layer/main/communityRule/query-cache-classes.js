const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class CommunityRuleQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("communityRule", [], Op.and, Op.eq, input, wClause);
  }
}
class CommunityRuleQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("communityRule", []);
  }
}

module.exports = {
  CommunityRuleQueryCache,
  CommunityRuleQueryCacheInvalidator,
};
