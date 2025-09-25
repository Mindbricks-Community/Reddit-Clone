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
  ModmailMessageQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getModmailMessageById = require("./utils/getModmailMessageById");

//not
//should i ask this here? is &&false intentionally added?

class DbUpdateModmailmessageCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, ModmailMessage, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdateModmailmessage";
    this.nullResult = false;
    this.objectName = "modmailMessage";
    this.serviceLabel = "redditclone-moderation-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "redditclone-moderation-service-dbevent-modmailmessage-updated";
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
    this.queryCacheInvalidator = new ModmailMessageQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "modmailMessage",
      this.session,
      this.requestId,
    );
    const dbData = await getModmailMessageById(this.dbData.id);
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

const dbUpdateModmailmessage = async (input) => {
  input.id = input.modmailMessageId;
  const dbUpdateCommand = new DbUpdateModmailmessageCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateModmailmessage;
