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

class DbGetVoteCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, Vote);
    this.commandName = "dbGetVote";
    this.nullResult = false;
    this.objectName = "vote";
    this.serviceLabel = "redditclone-content-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (Vote.getCqrsJoins) await Vote.getCqrsJoins(data);
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

const dbGetVote = (input) => {
  input.id = input.voteId;
  const dbGetCommand = new DbGetVoteCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetVote;
