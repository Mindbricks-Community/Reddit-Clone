const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { GlobalUserRestriction } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const {
  GlobalUserRestrictionQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteSequelizeCommand } = require("dbCommand");

class DbDeleteGlobaluserrestrictionCommand extends DBSoftDeleteSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, GlobalUserRestriction, instanceMode);
    this.commandName = "dbDeleteGlobaluserrestriction";
    this.nullResult = false;
    this.objectName = "globalUserRestriction";
    this.serviceLabel = "redditclone-adminops-service";
    this.dbEvent =
      "redditclone-adminops-service-dbevent-globaluserrestriction-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator =
      new GlobalUserRestrictionQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "globalUserRestriction",
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

const dbDeleteGlobaluserrestriction = async (input) => {
  input.id = input.globalUserRestrictionId;
  const dbDeleteCommand = new DbDeleteGlobaluserrestrictionCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteGlobaluserrestriction;
