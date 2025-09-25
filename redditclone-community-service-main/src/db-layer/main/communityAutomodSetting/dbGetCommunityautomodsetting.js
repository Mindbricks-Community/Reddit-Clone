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

class DbGetCommunityautomodsettingCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, CommunityAutomodSetting);
    this.commandName = "dbGetCommunityautomodsetting";
    this.nullResult = false;
    this.objectName = "communityAutomodSetting";
    this.serviceLabel = "redditclone-community-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (CommunityAutomodSetting.getCqrsJoins)
      await CommunityAutomodSetting.getCqrsJoins(data);
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

const dbGetCommunityautomodsetting = (input) => {
  input.id = input.communityAutomodSettingId;
  const dbGetCommand = new DbGetCommunityautomodsettingCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetCommunityautomodsetting;
