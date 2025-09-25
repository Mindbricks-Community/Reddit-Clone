const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class AbuseHeuristicTriggerQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("abuseHeuristicTrigger", [], Op.and, Op.eq, input, wClause);
  }
}
class AbuseHeuristicTriggerQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("abuseHeuristicTrigger", []);
  }
}

module.exports = {
  AbuseHeuristicTriggerQueryCache,
  AbuseHeuristicTriggerQueryCacheInvalidator,
};
