const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class AbuseInvestigationQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("abuseInvestigation", [], Op.and, Op.eq, input, wClause);
  }
}
class AbuseInvestigationQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("abuseInvestigation", []);
  }
}

module.exports = {
  AbuseInvestigationQueryCache,
  AbuseInvestigationQueryCacheInvalidator,
};
