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

class DbGetModerationactionCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, ModerationAction);
    this.commandName = "dbGetModerationaction";
    this.nullResult = false;
    this.objectName = "moderationAction";
    this.serviceLabel = "redditclone-moderation-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (ModerationAction.getCqrsJoins)
      await ModerationAction.getCqrsJoins(data);
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

const dbGetModerationaction = (input) => {
  input.id = input.moderationActionId;
  const dbGetCommand = new DbGetModerationactionCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetModerationaction;
