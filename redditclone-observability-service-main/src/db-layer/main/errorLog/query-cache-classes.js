const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class ErrorLogQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("errorLog", [], Op.and, Op.eq, input, wClause);
  }
}
class ErrorLogQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("errorLog", []);
  }
}

module.exports = {
  ErrorLogQueryCache,
  ErrorLogQueryCacheInvalidator,
};
