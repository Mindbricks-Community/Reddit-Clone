const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { CommunityMember } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const {
  CommunityMemberQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteSequelizeCommand } = require("dbCommand");

class DbDeleteCommunitymemberCommand extends DBSoftDeleteSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, CommunityMember, instanceMode);
    this.commandName = "dbDeleteCommunitymember";
    this.nullResult = false;
    this.objectName = "communityMember";
    this.serviceLabel = "redditclone-community-service";
    this.dbEvent =
      "redditclone-community-service-dbevent-communitymember-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new CommunityMemberQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "communityMember",
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

const dbDeleteCommunitymember = async (input) => {
  input.id = input.communityMemberId;
  const dbDeleteCommand = new DbDeleteCommunitymemberCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteCommunitymember;
