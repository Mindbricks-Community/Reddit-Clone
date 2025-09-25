const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class LocalizationKeyQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("localizationKey", [], Op.and, Op.eq, input, wClause);
  }
}
class LocalizationKeyQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("localizationKey", []);
  }
}

module.exports = {
  LocalizationKeyQueryCache,
  LocalizationKeyQueryCacheInvalidator,
};
