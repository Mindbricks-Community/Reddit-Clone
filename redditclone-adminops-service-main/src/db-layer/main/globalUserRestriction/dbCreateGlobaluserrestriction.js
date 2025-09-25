const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { GlobalUserRestriction } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { DBCreateSequelizeCommand } = require("dbCommand");

const {
  GlobalUserRestrictionQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getGlobalUserRestrictionById = require("./utils/getGlobalUserRestrictionById");

class DbCreateGlobaluserrestrictionCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateGlobaluserrestriction";
    this.objectName = "globalUserRestriction";
    this.serviceLabel = "redditclone-adminops-service";
    this.dbEvent =
      "redditclone-adminops-service-dbevent-globaluserrestriction-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator =
      new GlobalUserRestrictionQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "globalUserRestriction",
      this.session,
      this.requestId,
    );
    const dbData = await getGlobalUserRestrictionById(this.dbData.id);
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

    let globalUserRestriction = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      if (!updated && this.dataClause.id && !exists) {
        globalUserRestriction =
          globalUserRestriction ||
          (await GlobalUserRestriction.findByPk(this.dataClause.id));
        if (globalUserRestriction) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await globalUserRestriction.update(this.dataClause);
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
        "Error in checking unique index when creating GlobalUserRestriction",
        eDetail,
      );
    }

    if (!updated && !exists) {
      globalUserRestriction = await GlobalUserRestriction.create(
        this.dataClause,
      );
    }

    this.dbData = globalUserRestriction.getData();
    this.input.globalUserRestriction = this.dbData;
    await this.create_childs();
  }
}

const dbCreateGlobaluserrestriction = async (input) => {
  const dbCreateCommand = new DbCreateGlobaluserrestrictionCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateGlobaluserrestriction;
