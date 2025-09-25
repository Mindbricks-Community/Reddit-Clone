const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class ModmailThreadQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("modmailThread", [], Op.and, Op.eq, input, wClause);
  }
}
class ModmailThreadQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("modmailThread", []);
  }
}

module.exports = {
  ModmailThreadQueryCache,
  ModmailThreadQueryCacheInvalidator,
};
