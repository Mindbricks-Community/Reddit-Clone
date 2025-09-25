const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const {
  ModerationAction,
  AutomodEvent,
  ModerationAuditLog,
  ModmailThread,
  ModmailMessage,
} = require("models");
const { Op } = require("sequelize");
const { sequelize } = require("common");

const { DBUpdateSequelizeCommand } = require("dbCommand");

const {
  ModerationAuditLogQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getModerationAuditLogById = require("./utils/getModerationAuditLogById");

//not
//should i ask this here? is &&false intentionally added?

class DbUpdateModerationauditlogCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, ModerationAuditLog, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdateModerationauditlog";
    this.nullResult = false;
    this.objectName = "moderationAuditLog";
    this.serviceLabel = "redditclone-moderation-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "redditclone-moderation-service-dbevent-moderationauditlog-updated";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async transposeResult() {
    // transpose dbData
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

  // ask about this should i rename the whereClause to dataClause???

  async setCalculatedFieldsAfterInstance(data) {
    const input = this.input;
  }

  buildIncludes(forWhereClause) {
    if (!this.input.getJoins) forWhereClause = true;
    const includes = [];
    return includes;
  }
}

const dbUpdateModerationauditlog = async (input) => {
  input.id = input.moderationAuditLogId;
  const dbUpdateCommand = new DbUpdateModerationauditlogCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateModerationauditlog;
