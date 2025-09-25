const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class PollOptionQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("pollOption", [], Op.and, Op.eq, input, wClause);
  }
}
class PollOptionQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("pollOption", []);
  }
}

module.exports = {
  PollOptionQueryCache,
  PollOptionQueryCacheInvalidator,
};
