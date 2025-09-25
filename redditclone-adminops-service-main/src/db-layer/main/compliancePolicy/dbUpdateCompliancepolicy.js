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
  CompliancePolicyQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getCompliancePolicyById = require("./utils/getCompliancePolicyById");

//not
//should i ask this here? is &&false intentionally added?

class DbUpdateCompliancepolicyCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, CompliancePolicy, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdateCompliancepolicy";
    this.nullResult = false;
    this.objectName = "compliancePolicy";
    this.serviceLabel = "redditclone-adminops-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "redditclone-adminops-service-dbevent-compliancepolicy-updated";
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
    this.queryCacheInvalidator = new CompliancePolicyQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "compliancePolicy",
      this.session,
      this.requestId,
    );
    const dbData = await getCompliancePolicyById(this.dbData.id);
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

const dbUpdateCompliancepolicy = async (input) => {
  input.id = input.compliancePolicyId;
  const dbUpdateCommand = new DbUpdateCompliancepolicyCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateCompliancepolicy;
