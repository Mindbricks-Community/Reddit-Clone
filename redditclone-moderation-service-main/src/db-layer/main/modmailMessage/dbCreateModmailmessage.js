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

const { DBCreateSequelizeCommand } = require("dbCommand");

const {
  ModmailMessageQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getModmailMessageById = require("./utils/getModmailMessageById");

class DbCreateModmailmessageCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateModmailmessage";
    this.objectName = "modmailMessage";
    this.serviceLabel = "redditclone-moderation-service";
    this.dbEvent =
      "redditclone-moderation-service-dbevent-modmailmessage-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
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

  // should i add hooksDbLayer here?

  // ask about this should i rename the whereClause to dataClause???

  async create_childs() {}

  async transposeResult() {
    // transpose dbData
  }

  async runDbCommand() {
    await super.runDbCommand();

    let modmailMessage = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      if (!updated && this.dataClause.id && !exists) {
        modmailMessage =
          modmailMessage || (await ModmailMessage.findByPk(this.dataClause.id));
        if (modmailMessage) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await modmailMessage.update(this.dataClause);
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
        "Error in checking unique index when creating ModmailMessage",
        eDetail,
      );
    }

    if (!updated && !exists) {
      modmailMessage = await ModmailMessage.create(this.dataClause);
    }

    this.dbData = modmailMessage.getData();
    this.input.modmailMessage = this.dbData;
    await this.create_childs();
  }
}

const dbCreateModmailmessage = async (input) => {
  const dbCreateCommand = new DbCreateModmailmessageCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateModmailmessage;
