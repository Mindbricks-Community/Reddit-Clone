const { DBGetListSequelizeCommand } = require("dbCommand");
const { sequelize, hexaLogger } = require("common");
const { Op } = require("sequelize");
const {
  AbuseReport,
  AbuseFlag,
  AbuseHeuristicTrigger,
  AbuseInvestigation,
} = require("models");

class DbListAbusereportsCommand extends DBGetListSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbListAbusereports";
    this.emptyResult = true;
    this.objectName = "abuseReports";
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
    for (const abuseReport of this.dbData.items) {
      // tarnspose dbData item
    }
  }

  buildIncludes(forWhereClause) {
    if (!this.input.getJoins) forWhereClause = true;
    const includes = [];
    return includes;
  }

  async getCqrsJoins(item) {
    if (AbuseReport.getCqrsJoins) {
      await AbuseReport.getCqrsJoins(item);
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

    let abuseReports = null;

    const selectList = this.getSelectList();
    if (selectList && selectList.length) {
      options.attributes = selectList;
    }

    abuseReports = await AbuseReport.findAll(options);

    return abuseReports;
  }
}

const dbListAbusereports = (input) => {
  const dbGetListCommand = new DbListAbusereportsCommand(input);
  return dbGetListCommand.execute();
};

module.exports = dbListAbusereports;
