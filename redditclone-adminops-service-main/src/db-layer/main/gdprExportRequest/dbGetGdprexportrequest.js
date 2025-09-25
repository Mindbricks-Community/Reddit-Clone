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

class DbGetGdprexportrequestCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, GdprExportRequest);
    this.commandName = "dbGetGdprexportrequest";
    this.nullResult = false;
    this.objectName = "gdprExportRequest";
    this.serviceLabel = "redditclone-adminops-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (GdprExportRequest.getCqrsJoins)
      await GdprExportRequest.getCqrsJoins(data);
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

const dbGetGdprexportrequest = (input) => {
  input.id = input.gdprExportRequestId;
  const dbGetCommand = new DbGetGdprexportrequestCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetGdprexportrequest;
