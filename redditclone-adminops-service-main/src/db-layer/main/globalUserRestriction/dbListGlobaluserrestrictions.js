const { DBGetListSequelizeCommand } = require("dbCommand");
const { sequelize, hexaLogger } = require("common");
const { Op } = require("sequelize");
const {
  AdminUserAction,
  GdprExportRequest,
  GdprDeleteRequest,
  CompliancePolicy,
  GlobalUserRestriction,
} = require("models");

class DbListGlobaluserrestrictionsCommand extends DBGetListSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbListGlobaluserrestrictions";
    this.emptyResult = true;
    this.objectName = "globalUserRestrictions";
    this.serviceLabel = "redditclone-adminops-service";
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
    for (const globalUserRestriction of this.dbData.items) {
      // tarnspose dbData item
    }
  }

  buildIncludes(forWhereClause) {
    if (!this.input.getJoins) forWhereClause = true;
    const includes = [];
    return includes;
  }

  async getCqrsJoins(item) {
    if (GlobalUserRestriction.getCqrsJoins) {
      await GlobalUserRestriction.getCqrsJoins(item);
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

    let globalUserRestrictions = null;

    const selectList = this.getSelectList();
    if (selectList && selectList.length) {
      options.attributes = selectList;
    }

    globalUserRestrictions = await GlobalUserRestriction.findAll(options);

    return globalUserRestrictions;
  }
}

const dbListGlobaluserrestrictions = (input) => {
  const dbGetListCommand = new DbListGlobaluserrestrictionsCommand(input);
  return dbGetListCommand.execute();
};

module.exports = dbListGlobaluserrestrictions;
