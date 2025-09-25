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
  GdprExportRequestQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getGdprExportRequestById = require("./utils/getGdprExportRequestById");

//not
//should i ask this here? is &&false intentionally added?

class DbUpdateGdprexportrequestCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, GdprExportRequest, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdateGdprexportrequest";
    this.nullResult = false;
    this.objectName = "gdprExportRequest";
    this.serviceLabel = "redditclone-adminops-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "redditclone-adminops-service-dbevent-gdprexportrequest-updated";
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
    this.queryCacheInvalidator = new GdprExportRequestQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "gdprExportRequest",
      this.session,
      this.requestId,
    );
    const dbData = await getGdprExportRequestById(this.dbData.id);
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

const dbUpdateGdprexportrequest = async (input) => {
  input.id = input.gdprExportRequestId;
  const dbUpdateCommand = new DbUpdateGdprexportrequestCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateGdprexportrequest;
