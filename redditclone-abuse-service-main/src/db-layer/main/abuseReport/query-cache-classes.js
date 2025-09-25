const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class AbuseReportQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("abuseReport", [], Op.and, Op.eq, input, wClause);
  }
}
class AbuseReportQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("abuseReport", []);
  }
}

module.exports = {
  AbuseReportQueryCache,
  AbuseReportQueryCacheInvalidator,
};
