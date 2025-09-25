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

class DbGetCompliancepolicyCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, CompliancePolicy);
    this.commandName = "dbGetCompliancepolicy";
    this.nullResult = false;
    this.objectName = "compliancePolicy";
    this.serviceLabel = "redditclone-adminops-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (CompliancePolicy.getCqrsJoins)
      await CompliancePolicy.getCqrsJoins(data);
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

const dbGetCompliancepolicy = (input) => {
  input.id = input.compliancePolicyId;
  const dbGetCommand = new DbGetCompliancepolicyCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetCompliancepolicy;
