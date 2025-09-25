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

class DbGetAbuseinvestigationCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, AbuseInvestigation);
    this.commandName = "dbGetAbuseinvestigation";
    this.nullResult = false;
    this.objectName = "abuseInvestigation";
    this.serviceLabel = "redditclone-abuse-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (AbuseInvestigation.getCqrsJoins)
      await AbuseInvestigation.getCqrsJoins(data);
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

const dbGetAbuseinvestigation = (input) => {
  input.id = input.abuseInvestigationId;
  const dbGetCommand = new DbGetAbuseinvestigationCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetAbuseinvestigation;
