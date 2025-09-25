const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class SystemMetricQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("systemMetric", [], Op.and, Op.eq, input, wClause);
  }
}
class SystemMetricQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("systemMetric", []);
  }
}

module.exports = {
  SystemMetricQueryCache,
  SystemMetricQueryCacheInvalidator,
};
