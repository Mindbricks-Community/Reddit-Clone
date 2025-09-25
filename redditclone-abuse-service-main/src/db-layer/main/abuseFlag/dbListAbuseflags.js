const { DBGetListSequelizeCommand } = require("dbCommand");
const { sequelize, hexaLogger } = require("common");
const { Op } = require("sequelize");
const {
  AbuseReport,
  AbuseFlag,
  AbuseHeuristicTrigger,
  AbuseInvestigation,
} = require("models");

class DbListAbuseflagsCommand extends DBGetListSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbListAbuseflags";
    this.emptyResult = true;
    this.objectName = "abuseFlags";
    this.serviceLabel = "redditclone-abuse-service";
    this.input.pagination = null;
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  // should i add this here?

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    for (const abuseFlag of this.dbData.items) {
      // tarnspose dbData item
    }
  }

  buildIncludes(forWhereClause) {
    if (!this.input.getJoins) forWhereClause = true;
    const includes = [];
    return includes;
  }

  async getCqrsJoins(item) {
    if (AbuseFlag.getCqrsJoins) {
      await AbuseFlag.getCqrsJoins(item);
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

    let abuseFlags = null;

    const selectList = this.getSelectList();
    if (selectList && selectList.length) {
      options.attributes = selectList;
    }

    abuseFlags = await AbuseFlag.findAll(options);

    return abuseFlags;
  }
}

const dbListAbuseflags = (input) => {
  const dbGetListCommand = new DbListAbuseflagsCommand(input);
  return dbGetListCommand.execute();
};

module.exports = dbListAbuseflags;
