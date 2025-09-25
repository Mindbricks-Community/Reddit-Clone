const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { LocalizationString } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { DBCreateSequelizeCommand } = require("dbCommand");

const {
  LocalizationStringQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getLocalizationStringById = require("./utils/getLocalizationStringById");

class DbCreateLocalizationstringCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateLocalizationstring";
    this.objectName = "localizationString";
    this.serviceLabel = "redditclone-localization-service";
    this.dbEvent =
      "redditclone-localization-service-dbevent-localizationstring-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new LocalizationStringQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "localizationString",
      this.session,
      this.requestId,
    );
    const dbData = await getLocalizationStringById(this.dbData.id);
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

    let localizationString = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        keyId: this.dataClause.keyId,
        localeId: this.dataClause.localeId,
      };

      localizationString =
        localizationString ||
        (await LocalizationString.findOne({ where: whereClause }));

      if (localizationString) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" + "keyId-localeId",
        );
      }

      if (!updated && this.dataClause.id && !exists) {
        localizationString =
          localizationString ||
          (await LocalizationString.findByPk(this.dataClause.id));
        if (localizationString) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await localizationString.update(this.dataClause);
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
        "Error in checking unique index when creating LocalizationString",
        eDetail,
      );
    }

    if (!updated && !exists) {
      localizationString = await LocalizationString.create(this.dataClause);
    }

    this.dbData = localizationString.getData();
    this.input.localizationString = this.dbData;
    await this.create_childs();
  }
}

const dbCreateLocalizationstring = async (input) => {
  const dbCreateCommand = new DbCreateLocalizationstringCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateLocalizationstring;
