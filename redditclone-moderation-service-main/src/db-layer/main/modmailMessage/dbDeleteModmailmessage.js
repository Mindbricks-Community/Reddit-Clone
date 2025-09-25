const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { ModmailMessage } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const {
  ModmailMessageQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteSequelizeCommand } = require("dbCommand");

class DbDeleteModmailmessageCommand extends DBSoftDeleteSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, ModmailMessage, instanceMode);
    this.commandName = "dbDeleteModmailmessage";
    this.nullResult = false;
    this.objectName = "modmailMessage";
    this.serviceLabel = "redditclone-moderation-service";
    this.dbEvent =
      "redditclone-moderation-service-dbevent-modmailmessage-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
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
    await elasticIndexer.deleteData(this.dbData.id);
  }

  //should i add this here?

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    // transpose dbData
  }
}

const dbDeleteModmailmessage = async (input) => {
  input.id = input.modmailMessageId;
  const dbDeleteCommand = new DbDeleteModmailmessageCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteModmailmessage;
