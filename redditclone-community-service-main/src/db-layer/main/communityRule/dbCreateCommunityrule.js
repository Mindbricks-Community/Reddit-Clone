const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { CommunityRule } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { DBCreateSequelizeCommand } = require("dbCommand");

const { CommunityRuleQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getCommunityRuleById = require("./utils/getCommunityRuleById");

class DbCreateCommunityruleCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateCommunityrule";
    this.objectName = "communityRule";
    this.serviceLabel = "redditclone-community-service";
    this.dbEvent =
      "redditclone-community-service-dbevent-communityrule-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new CommunityRuleQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "communityRule",
      this.session,
      this.requestId,
    );
    const dbData = await getCommunityRuleById(this.dbData.id);
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

    let communityRule = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        communityId: this.dataClause.communityId,
        orderIndex: this.dataClause.orderIndex,
      };

      communityRule =
        communityRule || (await CommunityRule.findOne({ where: whereClause }));

      if (communityRule) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" + "communityId-orderIndex",
        );
      }

      if (!updated && this.dataClause.id && !exists) {
        communityRule =
          communityRule || (await CommunityRule.findByPk(this.dataClause.id));
        if (communityRule) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await communityRule.update(this.dataClause);
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
        "Error in checking unique index when creating CommunityRule",
        eDetail,
      );
    }

    if (!updated && !exists) {
      communityRule = await CommunityRule.create(this.dataClause);
    }

    this.dbData = communityRule.getData();
    this.input.communityRule = this.dbData;
    await this.create_childs();
  }
}

const dbCreateCommunityrule = async (input) => {
  const dbCreateCommand = new DbCreateCommunityruleCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateCommunityrule;
