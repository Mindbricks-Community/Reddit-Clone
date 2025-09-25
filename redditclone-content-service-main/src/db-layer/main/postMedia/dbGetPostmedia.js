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

class DbGetPostmediaCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, PostMedia);
    this.commandName = "dbGetPostmedia";
    this.nullResult = false;
    this.objectName = "postMedia";
    this.serviceLabel = "redditclone-content-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (PostMedia.getCqrsJoins) await PostMedia.getCqrsJoins(data);
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

const dbGetPostmedia = (input) => {
  input.id = input.postMediaId;
  const dbGetCommand = new DbGetPostmediaCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetPostmedia;
