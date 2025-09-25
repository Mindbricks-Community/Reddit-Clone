const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { CommunityAutomodSetting } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { DBCreateSequelizeCommand } = require("dbCommand");

const {
  CommunityAutomodSettingQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getCommunityAutomodSettingById = require("./utils/getCommunityAutomodSettingById");

class DbCreateCommunityautomodsettingCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateCommunityautomodsetting";
    this.objectName = "communityAutomodSetting";
    this.serviceLabel = "redditclone-community-service";
    this.dbEvent =
      "redditclone-community-service-dbevent-communityautomodsetting-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator =
      new CommunityAutomodSettingQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "communityAutomodSetting",
      this.session,
      this.requestId,
    );
    const dbData = await getCommunityAutomodSettingById(this.dbData.id);
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

    let communityAutomodSetting = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        communityId: this.dataClause.communityId,
      };

      communityAutomodSetting =
        communityAutomodSetting ||
        (await CommunityAutomodSetting.findOne({ where: whereClause }));

      if (communityAutomodSetting) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" + "communityId",
        );
      }

      if (!updated && this.dataClause.id && !exists) {
        communityAutomodSetting =
          communityAutomodSetting ||
          (await CommunityAutomodSetting.findByPk(this.dataClause.id));
        if (communityAutomodSetting) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await communityAutomodSetting.update(this.dataClause);
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
        "Error in checking unique index when creating CommunityAutomodSetting",
        eDetail,
      );
    }

    if (!updated && !exists) {
      communityAutomodSetting = await CommunityAutomodSetting.create(
        this.dataClause,
      );
    }

    this.dbData = communityAutomodSetting.getData();
    this.input.communityAutomodSetting = this.dbData;
    await this.create_childs();
  }
}

const dbCreateCommunityautomodsetting = async (input) => {
  const dbCreateCommand = new DbCreateCommunityautomodsettingCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateCommunityautomodsetting;
