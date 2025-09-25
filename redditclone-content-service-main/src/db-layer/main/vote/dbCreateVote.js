const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { Vote } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { DBCreateSequelizeCommand } = require("dbCommand");

const { VoteQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getVoteById = require("./utils/getVoteById");

class DbCreateVoteCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateVote";
    this.objectName = "vote";
    this.serviceLabel = "redditclone-content-service";
    this.dbEvent = "redditclone-content-service-dbevent-vote-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new VoteQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "vote",
      this.session,
      this.requestId,
    );
    const dbData = await getVoteById(this.dbData.id);
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

    let vote = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        userId: this.dataClause.userId,
        postId: this.dataClause.postId,
      };

      vote = vote || (await Vote.findOne({ where: whereClause }));

      if (vote) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" + "userId-postId",
        );
      }
      whereClause = {
        userId: this.dataClause.userId,
        commentId: this.dataClause.commentId,
      };

      vote = vote || (await Vote.findOne({ where: whereClause }));

      if (vote) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" + "userId-commentId",
        );
      }

      if (!updated && this.dataClause.id && !exists) {
        vote = vote || (await Vote.findByPk(this.dataClause.id));
        if (vote) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await vote.update(this.dataClause);
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
        "Error in checking unique index when creating Vote",
        eDetail,
      );
    }

    if (!updated && !exists) {
      vote = await Vote.create(this.dataClause);
    }

    this.dbData = vote.getData();
    this.input.vote = this.dbData;
    await this.create_childs();
  }
}

const dbCreateVote = async (input) => {
  const dbCreateCommand = new DbCreateVoteCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateVote;
