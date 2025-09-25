const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class ModerationAuditLogQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("moderationAuditLog", [], Op.and, Op.eq, input, wClause);
  }
}
class ModerationAuditLogQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("moderationAuditLog", []);
  }
}

module.exports = {
  ModerationAuditLogQueryCache,
  ModerationAuditLogQueryCacheInvalidator,
};
