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

class DbGetCommunityruleCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, CommunityRule);
    this.commandName = "dbGetCommunityrule";
    this.nullResult = false;
    this.objectName = "communityRule";
    this.serviceLabel = "redditclone-community-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (CommunityRule.getCqrsJoins) await CommunityRule.getCqrsJoins(data);
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

const dbGetCommunityrule = (input) => {
  input.id = input.communityRuleId;
  const dbGetCommand = new DbGetCommunityruleCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetCommunityrule;
