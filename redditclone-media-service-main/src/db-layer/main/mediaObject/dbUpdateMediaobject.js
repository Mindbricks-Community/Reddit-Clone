const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { MediaObject, MediaScan } = require("models");
const { Op } = require("sequelize");
const { sequelize } = require("common");

const { DBUpdateSequelizeCommand } = require("dbCommand");

const { MediaObjectQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getMediaObjectById = require("./utils/getMediaObjectById");

//not
//should i ask this here? is &&false intentionally added?

class DbUpdateMediaobjectCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, MediaObject, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdateMediaobject";
    this.nullResult = false;
    this.objectName = "mediaObject";
    this.serviceLabel = "redditclone-media-service";
    this.joinedCriteria = false;
    this.dbEvent = "redditclone-media-service-dbevent-mediaobject-updated";
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
    this.queryCacheInvalidator = new MediaObjectQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "mediaObject",
      this.session,
      this.requestId,
    );
    const dbData = await getMediaObjectById(this.dbData.id);
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

const dbUpdateMediaobject = async (input) => {
  input.id = input.mediaObjectId;
  const dbUpdateCommand = new DbUpdateMediaobjectCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateMediaobject;
