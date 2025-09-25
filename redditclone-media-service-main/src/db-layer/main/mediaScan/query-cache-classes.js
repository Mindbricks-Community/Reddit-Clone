const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class MediaScanQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("mediaScan", [], Op.and, Op.eq, input, wClause);
  }
}
class MediaScanQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("mediaScan", []);
  }
}

module.exports = {
  MediaScanQueryCache,
  MediaScanQueryCacheInvalidator,
};
