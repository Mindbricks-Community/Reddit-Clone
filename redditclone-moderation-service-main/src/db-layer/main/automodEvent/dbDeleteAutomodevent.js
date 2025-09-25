const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { AutomodEvent } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { AutomodEventQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteSequelizeCommand } = require("dbCommand");

class DbDeleteAutomodeventCommand extends DBSoftDeleteSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, AutomodEvent, instanceMode);
    this.commandName = "dbDeleteAutomodevent";
    this.nullResult = false;
    this.objectName = "automodEvent";
    this.serviceLabel = "redditclone-moderation-service";
    this.dbEvent =
      "redditclone-moderation-service-dbevent-automodevent-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new AutomodEventQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "automodEvent",
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

const dbDeleteAutomodevent = async (input) => {
  input.id = input.automodEventId;
  const dbDeleteCommand = new DbDeleteAutomodeventCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteAutomodevent;
