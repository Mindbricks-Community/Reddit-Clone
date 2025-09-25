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

const { ModmailThreadQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getModmailThreadById = require("./utils/getModmailThreadById");

//not
//should i ask this here? is &&false intentionally added?

class DbUpdateModmailthreadCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, ModmailThread, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdateModmailthread";
    this.nullResult = false;
    this.objectName = "modmailThread";
    this.serviceLabel = "redditclone-moderation-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "redditclone-moderation-service-dbevent-modmailthread-updated";
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
    this.queryCacheInvalidator = new ModmailThreadQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "modmailThread",
      this.session,
      this.requestId,
    );
    const dbData = await getModmailThreadById(this.dbData.id);
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

const dbUpdateModmailthread = async (input) => {
  input.id = input.modmailThreadId;
  const dbUpdateCommand = new DbUpdateModmailthreadCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateModmailthread;
