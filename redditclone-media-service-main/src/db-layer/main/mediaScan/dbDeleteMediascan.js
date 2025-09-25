const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { MediaScan } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { MediaScanQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteSequelizeCommand } = require("dbCommand");

class DbDeleteMediascanCommand extends DBSoftDeleteSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, MediaScan, instanceMode);
    this.commandName = "dbDeleteMediascan";
    this.nullResult = false;
    this.objectName = "mediaScan";
    this.serviceLabel = "redditclone-media-service";
    this.dbEvent = "redditclone-media-service-dbevent-mediascan-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new MediaScanQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "mediaScan",
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

const dbDeleteMediascan = async (input) => {
  input.id = input.mediaScanId;
  const dbDeleteCommand = new DbDeleteMediascanCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteMediascan;
