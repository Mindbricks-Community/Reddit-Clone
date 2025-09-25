const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { ModmailThread } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { DBCreateSequelizeCommand } = require("dbCommand");

const { ModmailThreadQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getModmailThreadById = require("./utils/getModmailThreadById");

class DbCreateModmailthreadCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateModmailthread";
    this.objectName = "modmailThread";
    this.serviceLabel = "redditclone-moderation-service";
    this.dbEvent =
      "redditclone-moderation-service-dbevent-modmailthread-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
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

  // should i add hooksDbLayer here?

  // ask about this should i rename the whereClause to dataClause???

  async create_childs() {}

  async transposeResult() {
    // transpose dbData
  }

  async runDbCommand() {
    await super.runDbCommand();

    let modmailThread = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      if (!updated && this.dataClause.id && !exists) {
        modmailThread =
          modmailThread || (await ModmailThread.findByPk(this.dataClause.id));
        if (modmailThread) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await modmailThread.update(this.dataClause);
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
        "Error in checking unique index when creating ModmailThread",
        eDetail,
      );
    }

    if (!updated && !exists) {
      modmailThread = await ModmailThread.create(this.dataClause);
    }

    this.dbData = modmailThread.getData();
    this.input.modmailThread = this.dbData;
    await this.create_childs();
  }
}

const dbCreateModmailthread = async (input) => {
  const dbCreateCommand = new DbCreateModmailthreadCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateModmailthread;
