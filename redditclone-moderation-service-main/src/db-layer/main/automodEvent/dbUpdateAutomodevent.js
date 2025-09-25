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

const { AutomodEventQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getAutomodEventById = require("./utils/getAutomodEventById");

//not
//should i ask this here? is &&false intentionally added?

class DbUpdateAutomodeventCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, AutomodEvent, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdateAutomodevent";
    this.nullResult = false;
    this.objectName = "automodEvent";
    this.serviceLabel = "redditclone-moderation-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "redditclone-moderation-service-dbevent-automodevent-updated";
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
    this.queryCacheInvalidator = new AutomodEventQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "automodEvent",
      this.session,
      this.requestId,
    );
    const dbData = await getAutomodEventById(this.dbData.id);
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

const dbUpdateAutomodevent = async (input) => {
  input.id = input.automodEventId;
  const dbUpdateCommand = new DbUpdateAutomodeventCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateAutomodevent;
