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

const { AbuseReportQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getAbuseReportById = require("./utils/getAbuseReportById");

//not
//should i ask this here? is &&false intentionally added?

class DbUpdateAbusereportCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, AbuseReport, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdateAbusereport";
    this.nullResult = false;
    this.objectName = "abuseReport";
    this.serviceLabel = "redditclone-abuse-service";
    this.joinedCriteria = false;
    this.dbEvent = "redditclone-abuse-service-dbevent-abusereport-updated";
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
    this.queryCacheInvalidator = new AbuseReportQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "abuseReport",
      this.session,
      this.requestId,
    );
    const dbData = await getAbuseReportById(this.dbData.id);
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

const dbUpdateAbusereport = async (input) => {
  input.id = input.abuseReportId;
  const dbUpdateCommand = new DbUpdateAbusereportCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateAbusereport;
