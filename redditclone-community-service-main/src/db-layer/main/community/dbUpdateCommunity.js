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

const { CommunityQueryCacheInvalidator } = require("./query-cache-classes");
const { CommunityEntityCache } = require("./entity-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getCommunityById = require("./utils/getCommunityById");

//not
//should i ask this here? is &&false intentionally added?

class DbUpdateCommunityCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, Community, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdateCommunity";
    this.nullResult = false;
    this.objectName = "community";
    this.serviceLabel = "redditclone-community-service";
    this.joinedCriteria = false;
    this.dbEvent = "redditclone-community-service-dbevent-community-updated";
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
    this.queryCacheInvalidator = new CommunityQueryCacheInvalidator();
  }

  createEntityCacher() {
    super.createEntityCacher();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "community",
      this.session,
      this.requestId,
    );
    const dbData = await getCommunityById(this.dbData.id);
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

const dbUpdateCommunity = async (input) => {
  input.id = input.communityId;
  const dbUpdateCommand = new DbUpdateCommunityCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateCommunity;
