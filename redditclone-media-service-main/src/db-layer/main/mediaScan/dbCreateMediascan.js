const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { MediaScan } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { DBCreateSequelizeCommand } = require("dbCommand");

const { MediaScanQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getMediaScanById = require("./utils/getMediaScanById");

class DbCreateMediascanCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateMediascan";
    this.objectName = "mediaScan";
    this.serviceLabel = "redditclone-media-service";
    this.dbEvent = "redditclone-media-service-dbevent-mediascan-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new MediaScanQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "mediaScan",
      this.session,
      this.requestId,
    );
    const dbData = await getMediaScanById(this.dbData.id);
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

    let mediaScan = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      if (!updated && this.dataClause.id && !exists) {
        mediaScan = mediaScan || (await MediaScan.findByPk(this.dataClause.id));
        if (mediaScan) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await mediaScan.update(this.dataClause);
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
        "Error in checking unique index when creating MediaScan",
        eDetail,
      );
    }

    if (!updated && !exists) {
      mediaScan = await MediaScan.create(this.dataClause);
    }

    this.dbData = mediaScan.getData();
    this.input.mediaScan = this.dbData;
    await this.create_childs();
  }
}

const dbCreateMediascan = async (input) => {
  const dbCreateCommand = new DbCreateMediascanCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateMediascan;
