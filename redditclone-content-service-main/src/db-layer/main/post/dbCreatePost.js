const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { Post } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { DBCreateSequelizeCommand } = require("dbCommand");

const { PostQueryCacheInvalidator } = require("./query-cache-classes");
const { PostEntityCache } = require("./entity-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getPostById = require("./utils/getPostById");

class DbCreatePostCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreatePost";
    this.objectName = "post";
    this.serviceLabel = "redditclone-content-service";
    this.dbEvent = "redditclone-content-service-dbevent-post-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
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

  // should i add hooksDbLayer here?

  // ask about this should i rename the whereClause to dataClause???

  async create_childs() {}

  async transposeResult() {
    // transpose dbData
  }

  async runDbCommand() {
    await super.runDbCommand();

    let post = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        communityId: this.dataClause.communityId,
        status: this.dataClause.status,
      };

      post = post || (await Post.findOne({ where: whereClause }));

      if (post) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" + "communityId-status",
        );
      }

      if (!updated && this.dataClause.id && !exists) {
        post = post || (await Post.findByPk(this.dataClause.id));
        if (post) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await post.update(this.dataClause);
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
        "Error in checking unique index when creating Post",
        eDetail,
      );
    }

    if (!updated && !exists) {
      post = await Post.create(this.dataClause);
    }

    this.dbData = post.getData();
    this.input.post = this.dbData;
    await this.create_childs();
  }
}

const dbCreatePost = async (input) => {
  const dbCreateCommand = new DbCreatePostCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreatePost;
