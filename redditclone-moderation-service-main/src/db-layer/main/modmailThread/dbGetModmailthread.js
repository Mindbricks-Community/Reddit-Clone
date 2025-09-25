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

class DbGetModmailthreadCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, ModmailThread);
    this.commandName = "dbGetModmailthread";
    this.nullResult = false;
    this.objectName = "modmailThread";
    this.serviceLabel = "redditclone-moderation-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (ModmailThread.getCqrsJoins) await ModmailThread.getCqrsJoins(data);
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

const dbGetModmailthread = (input) => {
  input.id = input.modmailThreadId;
  const dbGetCommand = new DbGetModmailthreadCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetModmailthread;
