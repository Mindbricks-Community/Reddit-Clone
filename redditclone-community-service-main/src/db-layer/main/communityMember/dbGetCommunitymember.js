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

class DbGetCommunitymemberCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, CommunityMember);
    this.commandName = "dbGetCommunitymember";
    this.nullResult = false;
    this.objectName = "communityMember";
    this.serviceLabel = "redditclone-community-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (CommunityMember.getCqrsJoins) await CommunityMember.getCqrsJoins(data);
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

const dbGetCommunitymember = (input) => {
  input.id = input.communityMemberId;
  const dbGetCommand = new DbGetCommunitymemberCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetCommunitymember;
