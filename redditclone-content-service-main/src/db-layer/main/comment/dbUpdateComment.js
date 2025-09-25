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

const { CommentQueryCacheInvalidator } = require("./query-cache-classes");
const { CommentEntityCache } = require("./entity-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getCommentById = require("./utils/getCommentById");

//not
//should i ask this here? is &&false intentionally added?

class DbUpdateCommentCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, Comment, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdateComment";
    this.nullResult = false;
    this.objectName = "comment";
    this.serviceLabel = "redditclone-content-service";
    this.joinedCriteria = false;
    this.dbEvent = "redditclone-content-service-dbevent-comment-updated";
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
    this.queryCacheInvalidator = new CommentQueryCacheInvalidator();
  }

  createEntityCacher() {
    super.createEntityCacher();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "comment",
      this.session,
      this.requestId,
    );
    const dbData = await getCommentById(this.dbData.id);
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

const dbUpdateComment = async (input) => {
  input.id = input.commentId;
  const dbUpdateCommand = new DbUpdateCommentCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateComment;
