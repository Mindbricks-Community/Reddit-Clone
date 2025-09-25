const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const {
  AbuseReport,
  AbuseFlag,
  AbuseHeuristicTrigger,
  AbuseInvestigation,
} = require("models");
const { Op } = require("sequelize");
const { sequelize } = require("common");

const { DBUpdateSequelizeCommand } = require("dbCommand");

const {
  AbuseInvestigationQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getAbuseInvestigationById = require("./utils/getAbuseInvestigationById");

//not
//should i ask this here? is &&false intentionally added?

class DbUpdateAbuseinvestigationCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, AbuseInvestigation, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdateAbuseinvestigation";
    this.nullResult = false;
    this.objectName = "abuseInvestigation";
    this.serviceLabel = "redditclone-abuse-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "redditclone-abuse-service-dbevent-abuseinvestigation-updated";
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
    this.queryCacheInvalidator = new AbuseInvestigationQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "abuseInvestigation",
      this.session,
      this.requestId,
    );
    const dbData = await getAbuseInvestigationById(this.dbData.id);
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

const dbUpdateAbuseinvestigation = async (input) => {
  input.id = input.abuseInvestigationId;
  const dbUpdateCommand = new DbUpdateAbuseinvestigationCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateAbuseinvestigation;
