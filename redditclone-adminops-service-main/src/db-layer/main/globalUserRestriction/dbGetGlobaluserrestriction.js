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
  AdminUserAction,
  GdprExportRequest,
  GdprDeleteRequest,
  CompliancePolicy,
  GlobalUserRestriction,
} = require("models");

const { DBGetSequelizeCommand } = require("dbCommand");

class DbGetGlobaluserrestrictionCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, GlobalUserRestriction);
    this.commandName = "dbGetGlobaluserrestriction";
    this.nullResult = false;
    this.objectName = "globalUserRestriction";
    this.serviceLabel = "redditclone-adminops-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (GlobalUserRestriction.getCqrsJoins)
      await GlobalUserRestriction.getCqrsJoins(data);
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

const dbGetGlobaluserrestriction = (input) => {
  input.id = input.globalUserRestrictionId;
  const dbGetCommand = new DbGetGlobaluserrestrictionCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetGlobaluserrestriction;
