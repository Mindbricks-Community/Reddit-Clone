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

const { Post, Comment, Vote, PollOption, PostMedia } = require("models");

const { DBGetSequelizeCommand } = require("dbCommand");

class DbGetPolloptionCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, PollOption);
    this.commandName = "dbGetPolloption";
    this.nullResult = false;
    this.objectName = "pollOption";
    this.serviceLabel = "redditclone-content-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (PollOption.getCqrsJoins) await PollOption.getCqrsJoins(data);
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

const dbGetPolloption = (input) => {
  input.id = input.pollOptionId;
  const dbGetCommand = new DbGetPolloptionCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetPolloption;
