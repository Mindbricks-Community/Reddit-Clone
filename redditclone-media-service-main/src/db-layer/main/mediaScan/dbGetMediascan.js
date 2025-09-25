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

const { MediaObject, MediaScan } = require("models");

const { DBGetSequelizeCommand } = require("dbCommand");

class DbGetMediascanCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, MediaScan);
    this.commandName = "dbGetMediascan";
    this.nullResult = false;
    this.objectName = "mediaScan";
    this.serviceLabel = "redditclone-media-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (MediaScan.getCqrsJoins) await MediaScan.getCqrsJoins(data);
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

const dbGetMediascan = (input) => {
  input.id = input.mediaScanId;
  const dbGetCommand = new DbGetMediascanCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetMediascan;
