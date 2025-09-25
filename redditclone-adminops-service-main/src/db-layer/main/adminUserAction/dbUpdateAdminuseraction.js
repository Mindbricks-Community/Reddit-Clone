const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const {
  AdminUserAction,
  GdprExportRequest,
  GdprDeleteRequest,
  CompliancePolicy,
  GlobalUserRestriction,
} = require("models");
const { Op } = require("sequelize");
const { sequelize } = require("common");

const { DBUpdateSequelizeCommand } = require("dbCommand");

const {
  AdminUserActionQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getAdminUserActionById = require("./utils/getAdminUserActionById");

//not
//should i ask this here? is &&false intentionally added?

class DbUpdateAdminuseractionCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, AdminUserAction, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdateAdminuseraction";
    this.nullResult = false;
    this.objectName = "adminUserAction";
    this.serviceLabel = "redditclone-adminops-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "redditclone-adminops-service-dbevent-adminuseraction-updated";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async transposeResult() {
    // transpose dbData
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new AdminUserActionQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "adminUserAction",
      this.session,
      this.requestId,
    );
    const dbData = await getAdminUserActionById(this.dbData.id);
    await elasticIndexer.indexData(dbData);
  }

  // ask about this should i rename the whereClause to dataClause???

  async setCalculatedFieldsAfterInstance(data) {
    const input = this.input;
  }

  buildIncludes(forWhereClause) {
    if (!this.input.getJoins) forWhereClause = true;
    const includes = [];
    return includes;
  }
}

const dbUpdateAdminuseraction = async (input) => {
  input.id = input.adminUserActionId;
  const dbUpdateCommand = new DbUpdateAdminuseractionCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateAdminuseraction;
