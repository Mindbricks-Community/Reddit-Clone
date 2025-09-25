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

class DbGetModerationauditlogCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, ModerationAuditLog);
    this.commandName = "dbGetModerationauditlog";
    this.nullResult = false;
    this.objectName = "moderationAuditLog";
    this.serviceLabel = "redditclone-moderation-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (ModerationAuditLog.getCqrsJoins)
      await ModerationAuditLog.getCqrsJoins(data);
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

const dbGetModerationauditlog = (input) => {
  input.id = input.moderationAuditLogId;
  const dbGetCommand = new DbGetModerationauditlogCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetModerationauditlog;
