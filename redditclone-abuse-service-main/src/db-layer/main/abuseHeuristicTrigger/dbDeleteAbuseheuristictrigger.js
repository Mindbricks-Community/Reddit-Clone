const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { AbuseHeuristicTrigger } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const {
  AbuseHeuristicTriggerQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteSequelizeCommand } = require("dbCommand");

class DbDeleteAbuseheuristictriggerCommand extends DBSoftDeleteSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, AbuseHeuristicTrigger, instanceMode);
    this.commandName = "dbDeleteAbuseheuristictrigger";
    this.nullResult = false;
    this.objectName = "abuseHeuristicTrigger";
    this.serviceLabel = "redditclone-abuse-service";
    this.dbEvent =
      "redditclone-abuse-service-dbevent-abuseheuristictrigger-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
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
    await elasticIndexer.deleteData(this.dbData.id);
  }

  //should i add this here?

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    // transpose dbData
  }
}

const dbDeleteAbuseheuristictrigger = async (input) => {
  input.id = input.abuseHeuristicTriggerId;
  const dbDeleteCommand = new DbDeleteAbuseheuristictriggerCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteAbuseheuristictrigger;
