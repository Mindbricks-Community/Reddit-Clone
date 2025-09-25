const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { Locale } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { DBCreateSequelizeCommand } = require("dbCommand");

const { LocaleQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getLocaleById = require("./utils/getLocaleById");

class DbCreateLocaleCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateLocale";
    this.objectName = "locale";
    this.serviceLabel = "redditclone-localization-service";
    this.dbEvent = "redditclone-localization-service-dbevent-locale-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new LocaleQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "locale",
      this.session,
      this.requestId,
    );
    const dbData = await getLocaleById(this.dbData.id);
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

    let locale = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      if (!updated && this.dataClause.id && !exists) {
        locale = locale || (await Locale.findByPk(this.dataClause.id));
        if (locale) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await locale.update(this.dataClause);
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
        "Error in checking unique index when creating Locale",
        eDetail,
      );
    }

    if (!updated && !exists) {
      locale = await Locale.create(this.dataClause);
    }

    this.dbData = locale.getData();
    this.input.locale = this.dbData;
    await this.create_childs();
  }
}

const dbCreateLocale = async (input) => {
  const dbCreateCommand = new DbCreateLocaleCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateLocale;
