const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { AutomodEvent } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { DBCreateSequelizeCommand } = require("dbCommand");

const { AutomodEventQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getAutomodEventById = require("./utils/getAutomodEventById");

class DbCreateAutomodeventCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateAutomodevent";
    this.objectName = "automodEvent";
    this.serviceLabel = "redditclone-moderation-service";
    this.dbEvent =
      "redditclone-moderation-service-dbevent-automodevent-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
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

  // should i add hooksDbLayer here?

  // ask about this should i rename the whereClause to dataClause???

  async create_childs() {}

  async transposeResult() {
    // transpose dbData
  }

  async runDbCommand() {
    await super.runDbCommand();

    let automodEvent = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      if (!updated && this.dataClause.id && !exists) {
        automodEvent =
          automodEvent || (await AutomodEvent.findByPk(this.dataClause.id));
        if (automodEvent) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await automodEvent.update(this.dataClause);
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
        "Error in checking unique index when creating AutomodEvent",
        eDetail,
      );
    }

    if (!updated && !exists) {
      automodEvent = await AutomodEvent.create(this.dataClause);
    }

    this.dbData = automodEvent.getData();
    this.input.automodEvent = this.dbData;
    await this.create_childs();
  }
}

const dbCreateAutomodevent = async (input) => {
  const dbCreateCommand = new DbCreateAutomodeventCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateAutomodevent;
