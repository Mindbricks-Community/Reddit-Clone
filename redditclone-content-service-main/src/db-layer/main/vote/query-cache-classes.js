const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class VoteQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("vote", [], Op.and, Op.eq, input, wClause);
  }
}
class VoteQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("vote", []);
  }
}

module.exports = {
  VoteQueryCache,
  VoteQueryCacheInvalidator,
};
