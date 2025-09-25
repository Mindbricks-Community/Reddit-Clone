const { DBGetListSequelizeCommand } = require("dbCommand");
const { sequelize, hexaLogger } = require("common");
const { Op } = require("sequelize");
const { Post, Comment, Vote, PollOption, PostMedia } = require("models");

const { PollOptionQueryCache } = require("./query-cache-classes");

class DbListPolloptionsCommand extends DBGetListSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbListPolloptions";
    this.emptyResult = true;
    this.objectName = "pollOptions";
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
    this.queryCacher = new PollOptionQueryCache(input, whereClause);
  }

  // should i add this here?

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    for (const pollOption of this.dbData.items) {
      // tarnspose dbData item
    }
  }

  buildIncludes(forWhereClause) {
    if (!this.input.getJoins) forWhereClause = true;
    const includes = [];
    return includes;
  }

  async getCqrsJoins(item) {
    if (PollOption.getCqrsJoins) {
      await PollOption.getCqrsJoins(item);
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

    let pollOptions = null;

    const selectList = this.getSelectList();
    if (selectList && selectList.length) {
      options.attributes = selectList;
    }

    pollOptions = await PollOption.findAll(options);

    return pollOptions;
  }
}

const dbListPolloptions = (input) => {
  const dbGetListCommand = new DbListPolloptionsCommand(input);
  return dbGetListCommand.execute();
};

module.exports = dbListPolloptions;
