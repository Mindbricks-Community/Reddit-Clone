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

const { MediaScanQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getMediaScanById = require("./utils/getMediaScanById");

//not
//should i ask this here? is &&false intentionally added?

class DbUpdateMediascanCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, MediaScan, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdateMediascan";
    this.nullResult = false;
    this.objectName = "mediaScan";
    this.serviceLabel = "redditclone-media-service";
    this.joinedCriteria = false;
    this.dbEvent = "redditclone-media-service-dbevent-mediascan-updated";
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
    this.queryCacheInvalidator = new MediaScanQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "mediaScan",
      this.session,
      this.requestId,
    );
    const dbData = await getMediaScanById(this.dbData.id);
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

const dbUpdateMediascan = async (input) => {
  input.id = input.mediaScanId;
  const dbUpdateCommand = new DbUpdateMediascanCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateMediascan;
