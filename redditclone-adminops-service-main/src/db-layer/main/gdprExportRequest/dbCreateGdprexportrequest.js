const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { GdprExportRequest } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { DBCreateSequelizeCommand } = require("dbCommand");

const {
  GdprExportRequestQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getGdprExportRequestById = require("./utils/getGdprExportRequestById");

class DbCreateGdprexportrequestCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateGdprexportrequest";
    this.objectName = "gdprExportRequest";
    this.serviceLabel = "redditclone-adminops-service";
    this.dbEvent =
      "redditclone-adminops-service-dbevent-gdprexportrequest-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new GdprExportRequestQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "gdprExportRequest",
      this.session,
      this.requestId,
    );
    const dbData = await getGdprExportRequestById(this.dbData.id);
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

    let gdprExportRequest = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      if (!updated && this.dataClause.id && !exists) {
        gdprExportRequest =
          gdprExportRequest ||
          (await GdprExportRequest.findByPk(this.dataClause.id));
        if (gdprExportRequest) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await gdprExportRequest.update(this.dataClause);
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
        "Error in checking unique index when creating GdprExportRequest",
        eDetail,
      );
    }

    if (!updated && !exists) {
      gdprExportRequest = await GdprExportRequest.create(this.dataClause);
    }

    this.dbData = gdprExportRequest.getData();
    this.input.gdprExportRequest = this.dbData;
    await this.create_childs();
  }
}

const dbCreateGdprexportrequest = async (input) => {
  const dbCreateCommand = new DbCreateGdprexportrequestCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateGdprexportrequest;
