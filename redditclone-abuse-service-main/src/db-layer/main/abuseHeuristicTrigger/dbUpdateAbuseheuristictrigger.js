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
  AbuseHeuristicTriggerQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getAbuseHeuristicTriggerById = require("./utils/getAbuseHeuristicTriggerById");

//not
//should i ask this here? is &&false intentionally added?

class DbUpdateAbuseheuristictriggerCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, AbuseHeuristicTrigger, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdateAbuseheuristictrigger";
    this.nullResult = false;
    this.objectName = "abuseHeuristicTrigger";
    this.serviceLabel = "redditclone-abuse-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "redditclone-abuse-service-dbevent-abuseheuristictrigger-updated";
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
      new AbuseHeuristicTriggerQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "abuseHeuristicTrigger",
      this.session,
      this.requestId,
    );
    const dbData = await getAbuseHeuristicTriggerById(this.dbData.id);
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

const dbUpdateAbuseheuristictrigger = async (input) => {
  input.id = input.abuseHeuristicTriggerId;
  const dbUpdateCommand = new DbUpdateAbuseheuristictriggerCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateAbuseheuristictrigger;
