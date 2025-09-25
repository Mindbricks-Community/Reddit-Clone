const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { CommunityAutomodSetting } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const {
  CommunityAutomodSettingQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteSequelizeCommand } = require("dbCommand");

class DbDeleteCommunityautomodsettingCommand extends DBSoftDeleteSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, CommunityAutomodSetting, instanceMode);
    this.commandName = "dbDeleteCommunityautomodsetting";
    this.nullResult = false;
    this.objectName = "communityAutomodSetting";
    this.serviceLabel = "redditclone-community-service";
    this.dbEvent =
      "redditclone-community-service-dbevent-communityautomodsetting-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator =
      new CommunityAutomodSettingQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "communityAutomodSetting",
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

const dbDeleteCommunityautomodsetting = async (input) => {
  input.id = input.communityAutomodSettingId;
  const dbDeleteCommand = new DbDeleteCommunityautomodsettingCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteCommunityautomodsetting;
