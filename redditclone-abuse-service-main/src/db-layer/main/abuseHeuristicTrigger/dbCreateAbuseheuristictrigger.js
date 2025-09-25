const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { AbuseHeuristicTrigger } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { DBCreateSequelizeCommand } = require("dbCommand");

const {
  AbuseHeuristicTriggerQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getAbuseHeuristicTriggerById = require("./utils/getAbuseHeuristicTriggerById");

class DbCreateAbuseheuristictriggerCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateAbuseheuristictrigger";
    this.objectName = "abuseHeuristicTrigger";
    this.serviceLabel = "redditclone-abuse-service";
    this.dbEvent =
      "redditclone-abuse-service-dbevent-abuseheuristictrigger-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator =
      new AbuseHeuristicTriggerQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "abuseHeuristicTrigger",
      this.session,
      this.requestId,
    );
    const dbData = await getAbuseHeuristicTriggerById(this.dbData.id);
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

    let abuseHeuristicTrigger = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        userId: this.dataClause.userId,
        ipAddress: this.dataClause.ipAddress,
        triggerType: this.dataClause.triggerType,
      };

      abuseHeuristicTrigger =
        abuseHeuristicTrigger ||
        (await AbuseHeuristicTrigger.findOne({ where: whereClause }));

      if (abuseHeuristicTrigger) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" +
            "userId-ipAddress-triggerType",
        );
      }

      if (!updated && this.dataClause.id && !exists) {
        abuseHeuristicTrigger =
          abuseHeuristicTrigger ||
          (await AbuseHeuristicTrigger.findByPk(this.dataClause.id));
        if (abuseHeuristicTrigger) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await abuseHeuristicTrigger.update(this.dataClause);
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
        "Error in checking unique index when creating AbuseHeuristicTrigger",
        eDetail,
      );
    }

    if (!updated && !exists) {
      abuseHeuristicTrigger = await AbuseHeuristicTrigger.create(
        this.dataClause,
      );
    }

    this.dbData = abuseHeuristicTrigger.getData();
    this.input.abuseHeuristicTrigger = this.dbData;
    await this.create_childs();
  }
}

const dbCreateAbuseheuristictrigger = async (input) => {
  const dbCreateCommand = new DbCreateAbuseheuristictriggerCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateAbuseheuristictrigger;
