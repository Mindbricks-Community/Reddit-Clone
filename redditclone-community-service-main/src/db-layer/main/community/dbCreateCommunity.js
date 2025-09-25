const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { Community } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { DBCreateSequelizeCommand } = require("dbCommand");

const { CommunityQueryCacheInvalidator } = require("./query-cache-classes");
const { CommunityEntityCache } = require("./entity-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getCommunityById = require("./utils/getCommunityById");

class DbCreateCommunityCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateCommunity";
    this.objectName = "community";
    this.serviceLabel = "redditclone-community-service";
    this.dbEvent = "redditclone-community-service-dbevent-community-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new CommunityQueryCacheInvalidator();
  }

  createEntityCacher() {
    super.createEntityCacher();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "community",
      this.session,
      this.requestId,
    );
    const dbData = await getCommunityById(this.dbData.id);
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

    let community = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        slug: this.dataClause.slug,
      };

      community =
        community || (await Community.findOne({ where: whereClause }));

      if (community) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" + "slug",
        );
      }

      if (!updated && this.dataClause.id && !exists) {
        community = community || (await Community.findByPk(this.dataClause.id));
        if (community) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await community.update(this.dataClause);
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
        "Error in checking unique index when creating Community",
        eDetail,
      );
    }

    if (!updated && !exists) {
      community = await Community.create(this.dataClause);
    }

    this.dbData = community.getData();
    this.input.community = this.dbData;
    await this.create_childs();
  }
}

const dbCreateCommunity = async (input) => {
  const dbCreateCommand = new DbCreateCommunityCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateCommunity;
