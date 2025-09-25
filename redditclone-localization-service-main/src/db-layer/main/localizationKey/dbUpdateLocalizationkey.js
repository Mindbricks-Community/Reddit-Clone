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

const {
  LocalizationKeyQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getLocalizationKeyById = require("./utils/getLocalizationKeyById");

//not
//should i ask this here? is &&false intentionally added?

class DbUpdateLocalizationkeyCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, LocalizationKey, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdateLocalizationkey";
    this.nullResult = false;
    this.objectName = "localizationKey";
    this.serviceLabel = "redditclone-localization-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "redditclone-localization-service-dbevent-localizationkey-updated";
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

const dbUpdateLocalizationkey = async (input) => {
  input.id = input.localizationKeyId;
  const dbUpdateCommand = new DbUpdateLocalizationkeyCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateLocalizationkey;
