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

const { PostQueryCacheInvalidator } = require("./query-cache-classes");
const { PostEntityCache } = require("./entity-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getPostById = require("./utils/getPostById");

//not
//should i ask this here? is &&false intentionally added?

class DbUpdatePostCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, Post, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdatePost";
    this.nullResult = false;
    this.objectName = "post";
    this.serviceLabel = "redditclone-content-service";
    this.joinedCriteria = false;
    this.dbEvent = "redditclone-content-service-dbevent-post-updated";
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
    this.queryCacheInvalidator = new PostQueryCacheInvalidator();
  }

  createEntityCacher() {
    super.createEntityCacher();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "post",
      this.session,
      this.requestId,
    );
    const dbData = await getPostById(this.dbData.id);
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

const dbUpdatePost = async (input) => {
  input.id = input.postId;
  const dbUpdateCommand = new DbUpdatePostCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdatePost;
