const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class LocaleQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("locale", [], Op.and, Op.eq, input, wClause);
  }
}
class LocaleQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("locale", []);
  }
}

module.exports = {
  LocaleQueryCache,
  LocaleQueryCacheInvalidator,
};
