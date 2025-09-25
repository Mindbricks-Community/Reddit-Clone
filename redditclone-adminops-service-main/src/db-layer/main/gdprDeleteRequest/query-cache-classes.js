const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class GdprDeleteRequestQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("gdprDeleteRequest", [], Op.and, Op.eq, input, wClause);
  }
}
class GdprDeleteRequestQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("gdprDeleteRequest", []);
  }
}

module.exports = {
  GdprDeleteRequestQueryCache,
  GdprDeleteRequestQueryCacheInvalidator,
};
