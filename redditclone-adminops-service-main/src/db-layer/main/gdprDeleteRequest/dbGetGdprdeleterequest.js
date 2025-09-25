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

class DbGetGdprdeleterequestCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, GdprDeleteRequest);
    this.commandName = "dbGetGdprdeleterequest";
    this.nullResult = false;
    this.objectName = "gdprDeleteRequest";
    this.serviceLabel = "redditclone-adminops-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (GdprDeleteRequest.getCqrsJoins)
      await GdprDeleteRequest.getCqrsJoins(data);
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

const dbGetGdprdeleterequest = (input) => {
  input.id = input.gdprDeleteRequestId;
  const dbGetCommand = new DbGetGdprdeleterequestCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetGdprdeleterequest;
