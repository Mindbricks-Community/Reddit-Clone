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
  GlobalUserRestrictionQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getGlobalUserRestrictionById = require("./utils/getGlobalUserRestrictionById");

//not
//should i ask this here? is &&false intentionally added?

class DbUpdateGlobaluserrestrictionCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, GlobalUserRestriction, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdateGlobaluserrestriction";
    this.nullResult = false;
    this.objectName = "globalUserRestriction";
    this.serviceLabel = "redditclone-adminops-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "redditclone-adminops-service-dbevent-globaluserrestriction-updated";
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
    this.queryCacheInvalidator =
      new GlobalUserRestrictionQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "globalUserRestriction",
      this.session,
      this.requestId,
    );
    const dbData = await getGlobalUserRestrictionById(this.dbData.id);
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

const dbUpdateGlobaluserrestriction = async (input) => {
  input.id = input.globalUserRestrictionId;
  const dbUpdateCommand = new DbUpdateGlobaluserrestrictionCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateGlobaluserrestriction;
