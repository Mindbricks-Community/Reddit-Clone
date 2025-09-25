const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { CommunityPinned } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { DBCreateSequelizeCommand } = require("dbCommand");

const {
  CommunityPinnedQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getCommunityPinnedById = require("./utils/getCommunityPinnedById");

class DbCreateCommunitypinnedCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateCommunitypinned";
    this.objectName = "communityPinned";
    this.serviceLabel = "redditclone-community-service";
    this.dbEvent =
      "redditclone-community-service-dbevent-communitypinned-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new CommunityPinnedQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "communityPinned",
      this.session,
      this.requestId,
    );
    const dbData = await getCommunityPinnedById(this.dbData.id);
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

    let communityPinned = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        communityId: this.dataClause.communityId,
        orderIndex: this.dataClause.orderIndex,
      };

      communityPinned =
        communityPinned ||
        (await CommunityPinned.findOne({ where: whereClause }));

      if (communityPinned) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" + "communityId-orderIndex",
        );
      }

      if (!updated && this.dataClause.id && !exists) {
        communityPinned =
          communityPinned ||
          (await CommunityPinned.findByPk(this.dataClause.id));
        if (communityPinned) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await communityPinned.update(this.dataClause);
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
        "Error in checking unique index when creating CommunityPinned",
        eDetail,
      );
    }

    if (!updated && !exists) {
      communityPinned = await CommunityPinned.create(this.dataClause);
    }

    this.dbData = communityPinned.getData();
    this.input.communityPinned = this.dbData;
    await this.create_childs();
  }
}

const dbCreateCommunitypinned = async (input) => {
  const dbCreateCommand = new DbCreateCommunitypinnedCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateCommunitypinned;
