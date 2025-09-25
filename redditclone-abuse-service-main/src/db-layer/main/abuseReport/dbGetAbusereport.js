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

class DbGetAbusereportCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, AbuseReport);
    this.commandName = "dbGetAbusereport";
    this.nullResult = false;
    this.objectName = "abuseReport";
    this.serviceLabel = "redditclone-abuse-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (AbuseReport.getCqrsJoins) await AbuseReport.getCqrsJoins(data);
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

const dbGetAbusereport = (input) => {
  input.id = input.abuseReportId;
  const dbGetCommand = new DbGetAbusereportCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetAbusereport;
