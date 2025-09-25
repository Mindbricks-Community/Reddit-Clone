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

const { PostEntityCache } = require("./entity-cache-classes");

class DbGetPostCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, Post);
    this.commandName = "dbGetPost";
    this.nullResult = false;
    this.objectName = "post";
    this.serviceLabel = "redditclone-content-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (Post.getCqrsJoins) await Post.getCqrsJoins(data);
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async checkEntityOwnership(entity) {
    return true;
  }

  createEntityCacher() {
    super.createEntityCacher();
    this.entityCacher = new PostEntityCache();
    this.entityCacher.defaultId = this.input.postId;
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

const dbGetPost = (input) => {
  input.id = input.postId;
  const dbGetCommand = new DbGetPostCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetPost;
