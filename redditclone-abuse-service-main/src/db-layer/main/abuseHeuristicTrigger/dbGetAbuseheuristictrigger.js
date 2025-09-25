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

class DbGetAbuseheuristictriggerCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, AbuseHeuristicTrigger);
    this.commandName = "dbGetAbuseheuristictrigger";
    this.nullResult = false;
    this.objectName = "abuseHeuristicTrigger";
    this.serviceLabel = "redditclone-abuse-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (AbuseHeuristicTrigger.getCqrsJoins)
      await AbuseHeuristicTrigger.getCqrsJoins(data);
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

const dbGetAbuseheuristictrigger = (input) => {
  input.id = input.abuseHeuristicTriggerId;
  const dbGetCommand = new DbGetAbuseheuristictriggerCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetAbuseheuristictrigger;
