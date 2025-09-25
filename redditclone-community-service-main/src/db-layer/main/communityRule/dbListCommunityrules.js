const { DBGetListSequelizeCommand } = require("dbCommand");
const { sequelize, hexaLogger } = require("common");
const { Op } = require("sequelize");
const {
  Community,
  CommunityMember,
  CommunityRule,
  CommunityPinned,
  CommunityAutomodSetting,
} = require("models");

const { CommunityRuleQueryCache } = require("./query-cache-classes");

class DbListCommunityrulesCommand extends DBGetListSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbListCommunityrules";
    this.emptyResult = true;
    this.objectName = "communityRules";
    this.serviceLabel = "redditclone-community-service";
    this.input.pagination = null;
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  createQueryCacher(input, whereClause) {
    super.createQueryCacher(input, whereClause);
    this.queryCacher = new CommunityRuleQueryCache(input, whereClause);
  }

  // should i add this here?

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    for (const communityRule of this.dbData.items) {
      // tarnspose dbData item
    }
  }

  buildIncludes(forWhereClause) {
    if (!this.input.getJoins) forWhereClause = true;
    const includes = [];
    return includes;
  }

  async getCqrsJoins(item) {
    if (CommunityRule.getCqrsJoins) {
      await CommunityRule.getCqrsJoins(item);
    }
  }

  async executeQuery() {
    const input = this.input;
    let options = { where: this.whereClause };
    if (input.sortBy) options.order = input.sortBy ?? [["id", "ASC"]];

    options.include = this.buildIncludes();
    if (options.include && options.include.length == 0) options.include = null;

    if (!input.getJoins) {
      options.include = null;
    }

    let communityRules = null;

    const selectList = this.getSelectList();
    if (selectList && selectList.length) {
      options.attributes = selectList;
    }

    communityRules = await CommunityRule.findAll(options);

    return communityRules;
  }
}

const dbListCommunityrules = (input) => {
  const dbGetListCommand = new DbListCommunityrulesCommand(input);
  return dbGetListCommand.execute();
};

module.exports = dbListCommunityrules;
