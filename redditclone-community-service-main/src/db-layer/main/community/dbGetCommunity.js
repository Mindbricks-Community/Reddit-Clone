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
  Community,
  CommunityMember,
  CommunityRule,
  CommunityPinned,
  CommunityAutomodSetting,
} = require("models");

const { DBGetSequelizeCommand } = require("dbCommand");

const { CommunityEntityCache } = require("./entity-cache-classes");

class DbGetCommunityCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, Community);
    this.commandName = "dbGetCommunity";
    this.nullResult = false;
    this.objectName = "community";
    this.serviceLabel = "redditclone-community-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (Community.getCqrsJoins) await Community.getCqrsJoins(data);
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async checkEntityOwnership(entity) {
    return true;
  }

  createEntityCacher() {
    super.createEntityCacher();
    this.entityCacher = new CommunityEntityCache();
    this.entityCacher.defaultId = this.input.communityId;
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

const dbGetCommunity = (input) => {
  input.id = input.communityId;
  const dbGetCommand = new DbGetCommunityCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetCommunity;
