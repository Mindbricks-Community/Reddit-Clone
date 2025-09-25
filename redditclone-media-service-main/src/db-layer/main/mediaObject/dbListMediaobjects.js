const { DBGetListSequelizeCommand } = require("dbCommand");
const { sequelize, hexaLogger } = require("common");
const { Op } = require("sequelize");
const { MediaObject, MediaScan } = require("models");

class DbListMediaobjectsCommand extends DBGetListSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbListMediaobjects";
    this.emptyResult = true;
    this.objectName = "mediaObjects";
    this.serviceLabel = "redditclone-media-service";
    this.input.pagination = null;
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  // should i add this here?

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    for (const mediaObject of this.dbData.items) {
      // tarnspose dbData item
    }
  }

  buildIncludes(forWhereClause) {
    if (!this.input.getJoins) forWhereClause = true;
    const includes = [];
    return includes;
  }

  async getCqrsJoins(item) {
    if (MediaObject.getCqrsJoins) {
      await MediaObject.getCqrsJoins(item);
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

    let mediaObjects = null;

    const selectList = this.getSelectList();
    if (selectList && selectList.length) {
      options.attributes = selectList;
    }

    mediaObjects = await MediaObject.findAll(options);

    return mediaObjects;
  }
}

const dbListMediaobjects = (input) => {
  const dbGetListCommand = new DbListMediaobjectsCommand(input);
  return dbGetListCommand.execute();
};

module.exports = dbListMediaobjects;
