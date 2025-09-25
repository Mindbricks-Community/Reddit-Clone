const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { GdprDeleteRequest } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const {
  GdprDeleteRequestQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteSequelizeCommand } = require("dbCommand");

class DbDeleteGdprdeleterequestCommand extends DBSoftDeleteSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, GdprDeleteRequest, instanceMode);
    this.commandName = "dbDeleteGdprdeleterequest";
    this.nullResult = false;
    this.objectName = "gdprDeleteRequest";
    this.serviceLabel = "redditclone-adminops-service";
    this.dbEvent =
      "redditclone-adminops-service-dbevent-gdprdeleterequest-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new GdprDeleteRequestQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "gdprDeleteRequest",
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

const dbDeleteGdprdeleterequest = async (input) => {
  input.id = input.gdprDeleteRequestId;
  const dbDeleteCommand = new DbDeleteGdprdeleterequestCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteGdprdeleterequest;
