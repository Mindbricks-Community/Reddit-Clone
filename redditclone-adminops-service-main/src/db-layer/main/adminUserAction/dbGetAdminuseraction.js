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

class DbGetAdminuseractionCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, AdminUserAction);
    this.commandName = "dbGetAdminuseraction";
    this.nullResult = false;
    this.objectName = "adminUserAction";
    this.serviceLabel = "redditclone-adminops-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (AdminUserAction.getCqrsJoins) await AdminUserAction.getCqrsJoins(data);
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

const dbGetAdminuseraction = (input) => {
  input.id = input.adminUserActionId;
  const dbGetCommand = new DbGetAdminuseractionCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetAdminuseraction;
