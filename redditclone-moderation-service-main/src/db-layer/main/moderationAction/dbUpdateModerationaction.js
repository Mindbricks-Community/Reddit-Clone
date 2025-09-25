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
  ModerationActionQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getModerationActionById = require("./utils/getModerationActionById");

//not
//should i ask this here? is &&false intentionally added?

class DbUpdateModerationactionCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, ModerationAction, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdateModerationaction";
    this.nullResult = false;
    this.objectName = "moderationAction";
    this.serviceLabel = "redditclone-moderation-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "redditclone-moderation-service-dbevent-moderationaction-updated";
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

const dbUpdateModerationaction = async (input) => {
  input.id = input.moderationActionId;
  const dbUpdateCommand = new DbUpdateModerationactionCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateModerationaction;
