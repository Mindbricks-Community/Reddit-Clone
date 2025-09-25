const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { Locale, LocalizationKey, LocalizationString } = require("models");
const { Op } = require("sequelize");
const { sequelize } = require("common");

const { DBUpdateSequelizeCommand } = require("dbCommand");

const { LocaleQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getLocaleById = require("./utils/getLocaleById");

//not
//should i ask this here? is &&false intentionally added?

class DbUpdateLocaleCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, Locale, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdateLocale";
    this.nullResult = false;
    this.objectName = "locale";
    this.serviceLabel = "redditclone-localization-service";
    this.joinedCriteria = false;
    this.dbEvent = "redditclone-localization-service-dbevent-locale-updated";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async transposeResult() {
    // transpose dbData
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

  // ask about this should i rename the whereClause to dataClause???

  async setCalculatedFieldsAfterInstance(data) {
    const input = this.input;
  }

  buildIncludes(forWhereClause) {
    if (!this.input.getJoins) forWhereClause = true;
    const includes = [];
    return includes;
  }
}

const dbUpdateLocale = async (input) => {
  input.id = input.localeId;
  const dbUpdateCommand = new DbUpdateLocaleCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateLocale;
