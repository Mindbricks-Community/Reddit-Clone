const { DBGetListSequelizeCommand } = require("dbCommand");
const { sequelize, hexaLogger } = require("common");
const { Op } = require("sequelize");
const {
  AbuseReport,
  AbuseFlag,
  AbuseHeuristicTrigger,
  AbuseInvestigation,
} = require("models");

class DbListAbuseinvestigationsCommand extends DBGetListSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbListAbuseinvestigations";
    this.emptyResult = true;
    this.objectName = "abuseInvestigations";
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
    for (const abuseInvestigation of this.dbData.items) {
      // tarnspose dbData item
    }
  }

  buildIncludes(forWhereClause) {
    if (!this.input.getJoins) forWhereClause = true;
    const includes = [];
    return includes;
  }

  async getCqrsJoins(item) {
    if (AbuseInvestigation.getCqrsJoins) {
      await AbuseInvestigation.getCqrsJoins(item);
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

    let abuseInvestigations = null;

    const selectList = this.getSelectList();
    if (selectList && selectList.length) {
      options.attributes = selectList;
    }

    abuseInvestigations = await AbuseInvestigation.findAll(options);

    return abuseInvestigations;
  }
}

const dbListAbuseinvestigations = (input) => {
  const dbGetListCommand = new DbListAbuseinvestigationsCommand(input);
  return dbGetListCommand.execute();
};

module.exports = dbListAbuseinvestigations;
