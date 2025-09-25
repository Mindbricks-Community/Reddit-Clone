const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { PostMedia } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { PostMediaQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteSequelizeCommand } = require("dbCommand");

class DbDeletePostmediaCommand extends DBSoftDeleteSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, PostMedia, instanceMode);
    this.commandName = "dbDeletePostmedia";
    this.nullResult = false;
    this.objectName = "postMedia";
    this.serviceLabel = "redditclone-content-service";
    this.dbEvent = "redditclone-content-service-dbevent-postmedia-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new PostMediaQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "postMedia",
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

const dbDeletePostmedia = async (input) => {
  input.id = input.postMediaId;
  const dbDeleteCommand = new DbDeletePostmediaCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeletePostmedia;
