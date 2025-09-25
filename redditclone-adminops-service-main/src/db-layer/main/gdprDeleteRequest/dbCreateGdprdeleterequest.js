const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { GdprDeleteRequest } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { DBCreateSequelizeCommand } = require("dbCommand");

const {
  GdprDeleteRequestQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getGdprDeleteRequestById = require("./utils/getGdprDeleteRequestById");

class DbCreateGdprdeleterequestCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateGdprdeleterequest";
    this.objectName = "gdprDeleteRequest";
    this.serviceLabel = "redditclone-adminops-service";
    this.dbEvent =
      "redditclone-adminops-service-dbevent-gdprdeleterequest-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new GdprDeleteRequestQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "gdprDeleteRequest",
      this.session,
      this.requestId,
    );
    const dbData = await getGdprDeleteRequestById(this.dbData.id);
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

    let gdprDeleteRequest = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      if (!updated && this.dataClause.id && !exists) {
        gdprDeleteRequest =
          gdprDeleteRequest ||
          (await GdprDeleteRequest.findByPk(this.dataClause.id));
        if (gdprDeleteRequest) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await gdprDeleteRequest.update(this.dataClause);
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
        "Error in checking unique index when creating GdprDeleteRequest",
        eDetail,
      );
    }

    if (!updated && !exists) {
      gdprDeleteRequest = await GdprDeleteRequest.create(this.dataClause);
    }

    this.dbData = gdprDeleteRequest.getData();
    this.input.gdprDeleteRequest = this.dbData;
    await this.create_childs();
  }
}

const dbCreateGdprdeleterequest = async (input) => {
  const dbCreateCommand = new DbCreateGdprdeleterequestCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateGdprdeleterequest;
