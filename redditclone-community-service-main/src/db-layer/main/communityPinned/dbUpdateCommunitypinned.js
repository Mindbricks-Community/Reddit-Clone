const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const {
  Community,
  CommunityMember,
  CommunityRule,
  CommunityPinned,
  CommunityAutomodSetting,
} = require("models");
const { Op } = require("sequelize");
const { sequelize } = require("common");

const { DBUpdateSequelizeCommand } = require("dbCommand");

const {
  CommunityPinnedQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getCommunityPinnedById = require("./utils/getCommunityPinnedById");

//not
//should i ask this here? is &&false intentionally added?

class DbUpdateCommunitypinnedCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, CommunityPinned, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdateCommunitypinned";
    this.nullResult = false;
    this.objectName = "communityPinned";
    this.serviceLabel = "redditclone-community-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "redditclone-community-service-dbevent-communitypinned-updated";
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
    this.queryCacheInvalidator = new CommunityPinnedQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "communityPinned",
      this.session,
      this.requestId,
    );
    const dbData = await getCommunityPinnedById(this.dbData.id);
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

const dbUpdateCommunitypinned = async (input) => {
  input.id = input.communityPinnedId;
  const dbUpdateCommand = new DbUpdateCommunitypinnedCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateCommunitypinned;
