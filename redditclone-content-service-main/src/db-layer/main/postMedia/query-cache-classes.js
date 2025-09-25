const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class PostMediaQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("postMedia", [], Op.and, Op.eq, input, wClause);
  }
}
class PostMediaQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("postMedia", []);
  }
}

module.exports = {
  PostMediaQueryCache,
  PostMediaQueryCacheInvalidator,
};
