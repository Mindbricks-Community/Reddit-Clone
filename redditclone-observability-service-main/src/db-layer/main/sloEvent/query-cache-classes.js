const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class SloEventQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("sloEvent", [], Op.and, Op.eq, input, wClause);
  }
}
class SloEventQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("sloEvent", []);
  }
}

module.exports = {
  SloEventQueryCache,
  SloEventQueryCacheInvalidator,
};
