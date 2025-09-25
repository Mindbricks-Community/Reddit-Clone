const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class ModmailMessageQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("modmailMessage", [], Op.and, Op.eq, input, wClause);
  }
}
class ModmailMessageQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("modmailMessage", []);
  }
}

module.exports = {
  ModmailMessageQueryCache,
  ModmailMessageQueryCacheInvalidator,
};
