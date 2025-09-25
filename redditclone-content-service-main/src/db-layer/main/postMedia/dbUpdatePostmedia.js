const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { Post, Comment, Vote, PollOption, PostMedia } = require("models");
const { Op } = require("sequelize");
const { sequelize } = require("common");

const { DBUpdateSequelizeCommand } = require("dbCommand");

const { PostMediaQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getPostMediaById = require("./utils/getPostMediaById");

//not
//should i ask this here? is &&false intentionally added?

class DbUpdatePostmediaCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, PostMedia, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdatePostmedia";
    this.nullResult = false;
    this.objectName = "postMedia";
    this.serviceLabel = "redditclone-content-service";
    this.joinedCriteria = false;
    this.dbEvent = "redditclone-content-service-dbevent-postmedia-updated";
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
    this.queryCacheInvalidator = new PostMediaQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "postMedia",
      this.session,
      this.requestId,
    );
    const dbData = await getPostMediaById(this.dbData.id);
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

const dbUpdatePostmedia = async (input) => {
  input.id = input.postMediaId;
  const dbUpdateCommand = new DbUpdatePostmediaCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdatePostmedia;
