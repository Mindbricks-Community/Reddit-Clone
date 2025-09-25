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
  ModerationAction,
  AutomodEvent,
  ModerationAuditLog,
  ModmailThread,
  ModmailMessage,
} = require("models");

const { DBGetSequelizeCommand } = require("dbCommand");

class DbGetAutomodeventCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, AutomodEvent);
    this.commandName = "dbGetAutomodevent";
    this.nullResult = false;
    this.objectName = "automodEvent";
    this.serviceLabel = "redditclone-moderation-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (AutomodEvent.getCqrsJoins) await AutomodEvent.getCqrsJoins(data);
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

const dbGetAutomodevent = (input) => {
  input.id = input.automodEventId;
  const dbGetCommand = new DbGetAutomodeventCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetAutomodevent;
