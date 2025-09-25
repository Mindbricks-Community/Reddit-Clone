const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { CommunityRule } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { CommunityRuleQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteSequelizeCommand } = require("dbCommand");

class DbDeleteCommunityruleCommand extends DBSoftDeleteSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, CommunityRule, instanceMode);
    this.commandName = "dbDeleteCommunityrule";
    this.nullResult = false;
    this.objectName = "communityRule";
    this.serviceLabel = "redditclone-community-service";
    this.dbEvent =
      "redditclone-community-service-dbevent-communityrule-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new CommunityRuleQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "communityRule",
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

const dbDeleteCommunityrule = async (input) => {
  input.id = input.communityRuleId;
  const dbDeleteCommand = new DbDeleteCommunityruleCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteCommunityrule;
