const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class AlertQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("alert", [], Op.and, Op.eq, input, wClause);
  }
}
class AlertQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("alert", []);
  }
}

module.exports = {
  AlertQueryCache,
  AlertQueryCacheInvalidator,
};
