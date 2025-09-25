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

const {
  LocalizationStringQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteSequelizeCommand } = require("dbCommand");

class DbDeleteLocalizationstringCommand extends DBSoftDeleteSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, LocalizationString, instanceMode);
    this.commandName = "dbDeleteLocalizationstring";
    this.nullResult = false;
    this.objectName = "localizationString";
    this.serviceLabel = "redditclone-localization-service";
    this.dbEvent =
      "redditclone-localization-service-dbevent-localizationstring-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
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
    await elasticIndexer.deleteData(this.dbData.id);
  }

  //should i add this here?

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    // transpose dbData
  }
}

const dbDeleteLocalizationstring = async (input) => {
  input.id = input.localizationStringId;
  const dbDeleteCommand = new DbDeleteLocalizationstringCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteLocalizationstring;
