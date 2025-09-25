const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { MediaObject } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { DBCreateSequelizeCommand } = require("dbCommand");

const { MediaObjectQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getMediaObjectById = require("./utils/getMediaObjectById");

class DbCreateMediaobjectCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateMediaobject";
    this.objectName = "mediaObject";
    this.serviceLabel = "redditclone-media-service";
    this.dbEvent = "redditclone-media-service-dbevent-mediaobject-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new MediaObjectQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "mediaObject",
      this.session,
      this.requestId,
    );
    const dbData = await getMediaObjectById(this.dbData.id);
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

    let mediaObject = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      if (!updated && this.dataClause.id && !exists) {
        mediaObject =
          mediaObject || (await MediaObject.findByPk(this.dataClause.id));
        if (mediaObject) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await mediaObject.update(this.dataClause);
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
        "Error in checking unique index when creating MediaObject",
        eDetail,
      );
    }

    if (!updated && !exists) {
      mediaObject = await MediaObject.create(this.dataClause);
    }

    this.dbData = mediaObject.getData();
    this.input.mediaObject = this.dbData;
    await this.create_childs();
  }
}

const dbCreateMediaobject = async (input) => {
  const dbCreateCommand = new DbCreateMediaobjectCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateMediaobject;
