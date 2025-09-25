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
  CommunityMemberQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getCommunityMemberById = require("./utils/getCommunityMemberById");

//not
//should i ask this here? is &&false intentionally added?

class DbUpdateCommunitymemberCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, CommunityMember, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdateCommunitymember";
    this.nullResult = false;
    this.objectName = "communityMember";
    this.serviceLabel = "redditclone-community-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "redditclone-community-service-dbevent-communitymember-updated";
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
    this.queryCacheInvalidator = new CommunityMemberQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "communityMember",
      this.session,
      this.requestId,
    );
    const dbData = await getCommunityMemberById(this.dbData.id);
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

const dbUpdateCommunitymember = async (input) => {
  input.id = input.communityMemberId;
  const dbUpdateCommand = new DbUpdateCommunitymemberCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateCommunitymember;
