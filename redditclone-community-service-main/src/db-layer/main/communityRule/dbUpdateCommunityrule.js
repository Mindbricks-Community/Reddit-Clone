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

const { CommunityRuleQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getCommunityRuleById = require("./utils/getCommunityRuleById");

//not
//should i ask this here? is &&false intentionally added?

class DbUpdateCommunityruleCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, CommunityRule, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdateCommunityrule";
    this.nullResult = false;
    this.objectName = "communityRule";
    this.serviceLabel = "redditclone-community-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "redditclone-community-service-dbevent-communityrule-updated";
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
    this.queryCacheInvalidator = new CommunityRuleQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "communityRule",
      this.session,
      this.requestId,
    );
    const dbData = await getCommunityRuleById(this.dbData.id);
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

const dbUpdateCommunityrule = async (input) => {
  input.id = input.communityRuleId;
  const dbUpdateCommand = new DbUpdateCommunityruleCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateCommunityrule;
