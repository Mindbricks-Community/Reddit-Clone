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

const { AbuseFlagQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getAbuseFlagById = require("./utils/getAbuseFlagById");

//not
//should i ask this here? is &&false intentionally added?

class DbUpdateAbuseflagCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, AbuseFlag, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdateAbuseflag";
    this.nullResult = false;
    this.objectName = "abuseFlag";
    this.serviceLabel = "redditclone-abuse-service";
    this.joinedCriteria = false;
    this.dbEvent = "redditclone-abuse-service-dbevent-abuseflag-updated";
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
    this.queryCacheInvalidator = new AbuseFlagQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "abuseFlag",
      this.session,
      this.requestId,
    );
    const dbData = await getAbuseFlagById(this.dbData.id);
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

const dbUpdateAbuseflag = async (input) => {
  input.id = input.abuseFlagId;
  const dbUpdateCommand = new DbUpdateAbuseflagCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateAbuseflag;
