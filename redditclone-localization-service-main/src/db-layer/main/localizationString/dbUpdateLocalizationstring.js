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
  LocalizationStringQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getLocalizationStringById = require("./utils/getLocalizationStringById");

//not
//should i ask this here? is &&false intentionally added?

class DbUpdateLocalizationstringCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, LocalizationString, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdateLocalizationstring";
    this.nullResult = false;
    this.objectName = "localizationString";
    this.serviceLabel = "redditclone-localization-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "redditclone-localization-service-dbevent-localizationstring-updated";
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

const dbUpdateLocalizationstring = async (input) => {
  input.id = input.localizationStringId;
  const dbUpdateCommand = new DbUpdateLocalizationstringCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateLocalizationstring;
