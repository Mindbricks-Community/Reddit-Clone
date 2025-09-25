const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { CommunityPinned } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const {
  CommunityPinnedQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteSequelizeCommand } = require("dbCommand");

class DbDeleteCommunitypinnedCommand extends DBSoftDeleteSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, CommunityPinned, instanceMode);
    this.commandName = "dbDeleteCommunitypinned";
    this.nullResult = false;
    this.objectName = "communityPinned";
    this.serviceLabel = "redditclone-community-service";
    this.dbEvent =
      "redditclone-community-service-dbevent-communitypinned-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new CommunityPinnedQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "communityPinned",
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

const dbDeleteCommunitypinned = async (input) => {
  input.id = input.communityPinnedId;
  const dbDeleteCommand = new DbDeleteCommunitypinnedCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteCommunitypinned;
