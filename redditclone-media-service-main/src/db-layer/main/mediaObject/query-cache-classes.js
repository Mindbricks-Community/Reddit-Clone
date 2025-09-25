const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class MediaObjectQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("mediaObject", [], Op.and, Op.eq, input, wClause);
  }
}
class MediaObjectQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("mediaObject", []);
  }
}

module.exports = {
  MediaObjectQueryCache,
  MediaObjectQueryCacheInvalidator,
};
