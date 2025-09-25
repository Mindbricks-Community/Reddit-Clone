const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class GdprExportRequestQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("gdprExportRequest", [], Op.and, Op.eq, input, wClause);
  }
}
class GdprExportRequestQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("gdprExportRequest", []);
  }
}

module.exports = {
  GdprExportRequestQueryCache,
  GdprExportRequestQueryCacheInvalidator,
};
