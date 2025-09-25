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

const { CommunityAutomodSettingQueryCache } = require("./query-cache-classes");

class DbListCommunityautomodsettingsCommand extends DBGetListSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbListCommunityautomodsettings";
    this.emptyResult = true;
    this.objectName = "communityAutomodSettings";
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
    this.queryCacher = new CommunityAutomodSettingQueryCache(
      input,
      whereClause,
    );
  }

  // should i add this here?

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    for (const communityAutomodSetting of this.dbData.items) {
      // tarnspose dbData item
    }
  }

  buildIncludes(forWhereClause) {
    if (!this.input.getJoins) forWhereClause = true;
    const includes = [];
    return includes;
  }

  async getCqrsJoins(item) {
    if (CommunityAutomodSetting.getCqrsJoins) {
      await CommunityAutomodSetting.getCqrsJoins(item);
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

    let communityAutomodSettings = null;

    const selectList = this.getSelectList();
    if (selectList && selectList.length) {
      options.attributes = selectList;
    }

    communityAutomodSettings = await CommunityAutomodSetting.findAll(options);

    return communityAutomodSettings;
  }
}

const dbListCommunityautomodsettings = (input) => {
  const dbGetListCommand = new DbListCommunityautomodsettingsCommand(input);
  return dbGetListCommand.execute();
};

module.exports = dbListCommunityautomodsettings;
