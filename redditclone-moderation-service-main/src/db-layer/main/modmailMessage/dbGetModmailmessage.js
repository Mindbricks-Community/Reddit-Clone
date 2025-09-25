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

class DbGetModmailmessageCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, ModmailMessage);
    this.commandName = "dbGetModmailmessage";
    this.nullResult = false;
    this.objectName = "modmailMessage";
    this.serviceLabel = "redditclone-moderation-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (ModmailMessage.getCqrsJoins) await ModmailMessage.getCqrsJoins(data);
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

const dbGetModmailmessage = (input) => {
  input.id = input.modmailMessageId;
  const dbGetCommand = new DbGetModmailmessageCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetModmailmessage;
