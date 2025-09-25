const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { ModerationAction } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { DBCreateSequelizeCommand } = require("dbCommand");

const {
  ModerationActionQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getModerationActionById = require("./utils/getModerationActionById");

class DbCreateModerationactionCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateModerationaction";
    this.objectName = "moderationAction";
    this.serviceLabel = "redditclone-moderation-service";
    this.dbEvent =
      "redditclone-moderation-service-dbevent-moderationaction-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new ModerationActionQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "moderationAction",
      this.session,
      this.requestId,
    );
    const dbData = await getModerationActionById(this.dbData.id);
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

    let moderationAction = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      if (!updated && this.dataClause.id && !exists) {
        moderationAction =
          moderationAction ||
          (await ModerationAction.findByPk(this.dataClause.id));
        if (moderationAction) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await moderationAction.update(this.dataClause);
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
        "Error in checking unique index when creating ModerationAction",
        eDetail,
      );
    }

    if (!updated && !exists) {
      moderationAction = await ModerationAction.create(this.dataClause);
    }

    this.dbData = moderationAction.getData();
    this.input.moderationAction = this.dbData;
    await this.create_childs();
  }
}

const dbCreateModerationaction = async (input) => {
  const dbCreateCommand = new DbCreateModerationactionCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateModerationaction;
