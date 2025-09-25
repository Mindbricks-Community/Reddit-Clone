const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class LocalizationStringQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("localizationString", [], Op.and, Op.eq, input, wClause);
  }
}
class LocalizationStringQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("localizationString", []);
  }
}

module.exports = {
  LocalizationStringQueryCache,
  LocalizationStringQueryCacheInvalidator,
};
