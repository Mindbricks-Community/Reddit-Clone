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

const { CommunityMemberQueryCache } = require("./query-cache-classes");

class DbListCommunitymembersCommand extends DBGetListSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbListCommunitymembers";
    this.emptyResult = true;
    this.objectName = "communityMembers";
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
    this.queryCacher = new CommunityMemberQueryCache(input, whereClause);
  }

  // should i add this here?

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    for (const communityMember of this.dbData.items) {
      // tarnspose dbData item
    }
  }

  buildIncludes(forWhereClause) {
    if (!this.input.getJoins) forWhereClause = true;
    const includes = [];
    return includes;
  }

  async getCqrsJoins(item) {
    if (CommunityMember.getCqrsJoins) {
      await CommunityMember.getCqrsJoins(item);
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

    let communityMembers = null;

    const selectList = this.getSelectList();
    if (selectList && selectList.length) {
      options.attributes = selectList;
    }

    communityMembers = await CommunityMember.findAll(options);

    return communityMembers;
  }
}

const dbListCommunitymembers = (input) => {
  const dbGetListCommand = new DbListCommunitymembersCommand(input);
  return dbGetListCommand.execute();
};

module.exports = dbListCommunitymembers;
