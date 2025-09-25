const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class AdminUserActionQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("adminUserAction", [], Op.and, Op.eq, input, wClause);
  }
}
class AdminUserActionQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("adminUserAction", []);
  }
}

module.exports = {
  AdminUserActionQueryCache,
  AdminUserActionQueryCacheInvalidator,
};
