const { sequelize } = require("common");
const { Op } = require("sequelize");
const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { hexaLogger } = require("common");

const {
  AbuseReport,
  AbuseFlag,
  AbuseHeuristicTrigger,
  AbuseInvestigation,
} = require("models");

const { DBGetSequelizeCommand } = require("dbCommand");

class DbGetAbuseflagCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, AbuseFlag);
    this.commandName = "dbGetAbuseflag";
    this.nullResult = false;
    this.objectName = "abuseFlag";
    this.serviceLabel = "redditclone-abuse-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (AbuseFlag.getCqrsJoins) await AbuseFlag.getCqrsJoins(data);
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async checkEntityOwnership(entity) {
    return true;
  }

  async transposeResult() {
    // transpose dbData
  }

  buildIncludes(forWhereClause) {
    if (!this.input.getJoins) forWhereClause = true;
    const includes = [];
    return includes;
  }
}

const dbGetAbuseflag = (input) => {
  input.id = input.abuseFlagId;
  const dbGetCommand = new DbGetAbuseflagCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetAbuseflag;
