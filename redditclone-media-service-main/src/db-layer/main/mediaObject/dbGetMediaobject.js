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

class DbGetMediaobjectCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, MediaObject);
    this.commandName = "dbGetMediaobject";
    this.nullResult = false;
    this.objectName = "mediaObject";
    this.serviceLabel = "redditclone-media-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (MediaObject.getCqrsJoins) await MediaObject.getCqrsJoins(data);
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

const dbGetMediaobject = (input) => {
  input.id = input.mediaObjectId;
  const dbGetCommand = new DbGetMediaobjectCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetMediaobject;
