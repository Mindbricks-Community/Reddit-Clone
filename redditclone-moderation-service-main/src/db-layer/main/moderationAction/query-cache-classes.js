const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class ModerationActionQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("moderationAction", [], Op.and, Op.eq, input, wClause);
  }
}
class ModerationActionQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("moderationAction", []);
  }
}

module.exports = {
  ModerationActionQueryCache,
  ModerationActionQueryCacheInvalidator,
};
