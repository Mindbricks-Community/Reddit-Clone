const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class AutomodEventQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("automodEvent", [], Op.and, Op.eq, input, wClause);
  }
}
class AutomodEventQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("automodEvent", []);
  }
}

module.exports = {
  AutomodEventQueryCache,
  AutomodEventQueryCacheInvalidator,
};
