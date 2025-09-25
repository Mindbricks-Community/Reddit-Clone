const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class GlobalUserRestrictionQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("globalUserRestriction", [], Op.and, Op.eq, input, wClause);
  }
}
class GlobalUserRestrictionQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("globalUserRestriction", []);
  }
}

module.exports = {
  GlobalUserRestrictionQueryCache,
  GlobalUserRestrictionQueryCacheInvalidator,
};
