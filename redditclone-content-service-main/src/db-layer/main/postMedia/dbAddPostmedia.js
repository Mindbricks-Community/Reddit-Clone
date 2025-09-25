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

const { DBCreateSequelizeCommand } = require("dbCommand");

const { PostMediaQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getPostMediaById = require("./utils/getPostMediaById");

class DbAddPostmediaCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbAddPostmedia";
    this.objectName = "postMedia";
    this.serviceLabel = "redditclone-content-service";
    this.dbEvent = "redditclone-content-service-dbevent-postmedia-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
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

  // should i add hooksDbLayer here?

  // ask about this should i rename the whereClause to dataClause???

  async create_childs() {}

  async transposeResult() {
    // transpose dbData
  }

  async runDbCommand() {
    await super.runDbCommand();

    let postMedia = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        mediaObjectId: this.dataClause.mediaObjectId,
        postId: this.dataClause.postId,
        commentId: this.dataClause.commentId,
      };

      postMedia =
        postMedia || (await PostMedia.findOne({ where: whereClause }));

      if (postMedia) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" +
            "mediaObjectId-postId-commentId",
        );
      }

      if (!updated && this.dataClause.id && !exists) {
        postMedia = postMedia || (await PostMedia.findByPk(this.dataClause.id));
        if (postMedia) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await postMedia.update(this.dataClause);
          updated = true;
        }
      }
    } catch (error) {
      const eDetail = {
        whereClause: this.normalizeSequalizeOps(whereClause),
        dataClause: this.dataClause,
        errorStack: error.stack,
        checkoutResult: this.input.checkoutResult,
      };
      throw new HttpServerError(
        "Error in checking unique index when creating PostMedia",
        eDetail,
      );
    }

    if (!updated && !exists) {
      postMedia = await PostMedia.create(this.dataClause);
    }

    this.dbData = postMedia.getData();
    this.input.postMedia = this.dbData;
    await this.create_childs();
  }
}

const dbAddPostmedia = async (input) => {
  const dbCreateCommand = new DbAddPostmediaCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbAddPostmedia;
