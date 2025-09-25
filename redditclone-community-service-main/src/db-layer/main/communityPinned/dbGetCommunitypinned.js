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

class DbGetCommunitypinnedCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, CommunityPinned);
    this.commandName = "dbGetCommunitypinned";
    this.nullResult = false;
    this.objectName = "communityPinned";
    this.serviceLabel = "redditclone-community-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (CommunityPinned.getCqrsJoins) await CommunityPinned.getCqrsJoins(data);
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

const dbGetCommunitypinned = (input) => {
  input.id = input.communityPinnedId;
  const dbGetCommand = new DbGetCommunitypinnedCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetCommunitypinned;
