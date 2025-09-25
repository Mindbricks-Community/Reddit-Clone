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

const {
  ModerationAuditLogQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteSequelizeCommand } = require("dbCommand");

class DbDeleteModerationauditlogCommand extends DBSoftDeleteSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, ModerationAuditLog, instanceMode);
    this.commandName = "dbDeleteModerationauditlog";
    this.nullResult = false;
    this.objectName = "moderationAuditLog";
    this.serviceLabel = "redditclone-moderation-service";
    this.dbEvent =
      "redditclone-moderation-service-dbevent-moderationauditlog-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
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
    await elasticIndexer.deleteData(this.dbData.id);
  }

  //should i add this here?

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    // transpose dbData
  }
}

const dbDeleteModerationauditlog = async (input) => {
  input.id = input.moderationAuditLogId;
  const dbDeleteCommand = new DbDeleteModerationauditlogCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteModerationauditlog;
