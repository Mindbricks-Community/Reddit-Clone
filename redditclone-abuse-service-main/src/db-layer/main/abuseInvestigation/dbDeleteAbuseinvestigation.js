const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { AbuseInvestigation } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const {
  AbuseInvestigationQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteSequelizeCommand } = require("dbCommand");

class DbDeleteAbuseinvestigationCommand extends DBSoftDeleteSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, AbuseInvestigation, instanceMode);
    this.commandName = "dbDeleteAbuseinvestigation";
    this.nullResult = false;
    this.objectName = "abuseInvestigation";
    this.serviceLabel = "redditclone-abuse-service";
    this.dbEvent =
      "redditclone-abuse-service-dbevent-abuseinvestigation-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
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
    await elasticIndexer.deleteData(this.dbData.id);
  }

  //should i add this here?

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    // transpose dbData
  }
}

const dbDeleteAbuseinvestigation = async (input) => {
  input.id = input.abuseInvestigationId;
  const dbDeleteCommand = new DbDeleteAbuseinvestigationCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteAbuseinvestigation;
