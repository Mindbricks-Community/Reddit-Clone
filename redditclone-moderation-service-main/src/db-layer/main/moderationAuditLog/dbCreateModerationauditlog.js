const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { ModerationAuditLog } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { DBCreateSequelizeCommand } = require("dbCommand");

const {
  ModerationAuditLogQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getModerationAuditLogById = require("./utils/getModerationAuditLogById");

class DbCreateModerationauditlogCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateModerationauditlog";
    this.objectName = "moderationAuditLog";
    this.serviceLabel = "redditclone-moderation-service";
    this.dbEvent =
      "redditclone-moderation-service-dbevent-moderationauditlog-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new ModerationAuditLogQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "moderationAuditLog",
      this.session,
      this.requestId,
    );
    const dbData = await getModerationAuditLogById(this.dbData.id);
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

    let moderationAuditLog = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      if (!updated && this.dataClause.id && !exists) {
        moderationAuditLog =
          moderationAuditLog ||
          (await ModerationAuditLog.findByPk(this.dataClause.id));
        if (moderationAuditLog) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await moderationAuditLog.update(this.dataClause);
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
        "Error in checking unique index when creating ModerationAuditLog",
        eDetail,
      );
    }

    if (!updated && !exists) {
      moderationAuditLog = await ModerationAuditLog.create(this.dataClause);
    }

    this.dbData = moderationAuditLog.getData();
    this.input.moderationAuditLog = this.dbData;
    await this.create_childs();
  }
}

const dbCreateModerationauditlog = async (input) => {
  const dbCreateCommand = new DbCreateModerationauditlogCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateModerationauditlog;
