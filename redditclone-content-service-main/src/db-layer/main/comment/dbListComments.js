const { DBGetListSequelizeCommand } = require("dbCommand");
const { sequelize, hexaLogger } = require("common");
const { Op } = require("sequelize");
const { Post, Comment, Vote, PollOption, PostMedia } = require("models");

const { CommentQueryCache } = require("./query-cache-classes");

class DbListCommentsCommand extends DBGetListSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbListComments";
    this.emptyResult = true;
    this.objectName = "comments";
    this.serviceLabel = "redditclone-content-service";
    this.input.pagination = null;
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  createQueryCacher(input, whereClause) {
    super.createQueryCacher(input, whereClause);
    this.queryCacher = new CommentQueryCache(input, whereClause);
  }

  // should i add this here?

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    for (const comment of this.dbData.items) {
      // tarnspose dbData item
    }
  }

  buildIncludes(forWhereClause) {
    if (!this.input.getJoins) forWhereClause = true;
    const includes = [];
    return includes;
  }

  async getCqrsJoins(item) {
    if (Comment.getCqrsJoins) {
      await Comment.getCqrsJoins(item);
    }
  }

  async executeQuery() {
    const input = this.input;
    let options = { where: this.whereClause };
    if (input.sortBy) options.order = input.sortBy ?? [["id", "ASC"]];

    options.include = this.buildIncludes();
    if (options.include && options.include.length == 0) options.include = null;

    if (!input.getJoins) {
      options.include = null;
    }

    let comments = null;

    const selectList = this.getSelectList();
    if (selectList && selectList.length) {
      options.attributes = selectList;
    }

    comments = await Comment.findAll(options);

    return comments;
  }
}

const dbListComments = (input) => {
  const dbGetListCommand = new DbListCommentsCommand(input);
  return dbGetListCommand.execute();
};

module.exports = dbListComments;
