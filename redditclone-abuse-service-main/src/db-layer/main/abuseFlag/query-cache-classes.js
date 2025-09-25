const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class AbuseFlagQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("abuseFlag", [], Op.and, Op.eq, input, wClause);
  }
}
class AbuseFlagQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("abuseFlag", []);
  }
}

module.exports = {
  AbuseFlagQueryCache,
  AbuseFlagQueryCacheInvalidator,
};
