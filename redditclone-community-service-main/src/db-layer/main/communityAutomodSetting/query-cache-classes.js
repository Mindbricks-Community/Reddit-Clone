const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class CommunityAutomodSettingQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("communityAutomodSetting", [], Op.and, Op.eq, input, wClause);
  }
}
class CommunityAutomodSettingQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("communityAutomodSetting", []);
  }
}

module.exports = {
  CommunityAutomodSettingQueryCache,
  CommunityAutomodSettingQueryCacheInvalidator,
};
