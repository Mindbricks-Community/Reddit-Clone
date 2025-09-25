const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { LocalizationKey } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { DBCreateSequelizeCommand } = require("dbCommand");

const {
  LocalizationKeyQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getLocalizationKeyById = require("./utils/getLocalizationKeyById");

class DbCreateLocalizationkeyCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateLocalizationkey";
    this.objectName = "localizationKey";
    this.serviceLabel = "redditclone-localization-service";
    this.dbEvent =
      "redditclone-localization-service-dbevent-localizationkey-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new LocalizationKeyQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "localizationKey",
      this.session,
      this.requestId,
    );
    const dbData = await getLocalizationKeyById(this.dbData.id);
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

    let localizationKey = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        uiKey: this.dataClause.uiKey,
      };

      localizationKey =
        localizationKey ||
        (await LocalizationKey.findOne({ where: whereClause }));

      if (localizationKey) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" + "uiKey",
        );
      }

      if (!updated && this.dataClause.id && !exists) {
        localizationKey =
          localizationKey ||
          (await LocalizationKey.findByPk(this.dataClause.id));
        if (localizationKey) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await localizationKey.update(this.dataClause);
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
        "Error in checking unique index when creating LocalizationKey",
        eDetail,
      );
    }

    if (!updated && !exists) {
      localizationKey = await LocalizationKey.create(this.dataClause);
    }

    this.dbData = localizationKey.getData();
    this.input.localizationKey = this.dbData;
    await this.create_childs();
  }
}

const dbCreateLocalizationkey = async (input) => {
  const dbCreateCommand = new DbCreateLocalizationkeyCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateLocalizationkey;
