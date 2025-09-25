const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class CompliancePolicyQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("compliancePolicy", [], Op.and, Op.eq, input, wClause);
  }
}
class CompliancePolicyQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("compliancePolicy", []);
  }
}

module.exports = {
  CompliancePolicyQueryCache,
  CompliancePolicyQueryCacheInvalidator,
};
