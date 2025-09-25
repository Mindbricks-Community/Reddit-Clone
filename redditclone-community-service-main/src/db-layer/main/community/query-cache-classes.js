const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class CommunityQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("community", [], Op.and, Op.eq, input, wClause);
  }
}
class CommunityQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("community", []);
  }
}

module.exports = {
  CommunityQueryCache,
  CommunityQueryCacheInvalidator,
};
