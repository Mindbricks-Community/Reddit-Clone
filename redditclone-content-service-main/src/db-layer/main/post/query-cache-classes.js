const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class PostQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("post", [], Op.and, Op.eq, input, wClause);
  }
}
class PostQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("post", []);
  }
}

module.exports = {
  PostQueryCache,
  PostQueryCacheInvalidator,
};
