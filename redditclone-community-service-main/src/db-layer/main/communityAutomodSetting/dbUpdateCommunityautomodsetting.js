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
  CommunityAutomodSettingQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getCommunityAutomodSettingById = require("./utils/getCommunityAutomodSettingById");

//not
//should i ask this here? is &&false intentionally added?

class DbUpdateCommunityautomodsettingCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, CommunityAutomodSetting, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdateCommunityautomodsetting";
    this.nullResult = false;
    this.objectName = "communityAutomodSetting";
    this.serviceLabel = "redditclone-community-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "redditclone-community-service-dbevent-communityautomodsetting-updated";
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
    this.queryCacheInvalidator =
      new CommunityAutomodSettingQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "communityAutomodSetting",
      this.session,
      this.requestId,
    );
    const dbData = await getCommunityAutomodSettingById(this.dbData.id);
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

const dbUpdateCommunityautomodsetting = async (input) => {
  input.id = input.communityAutomodSettingId;
  const dbUpdateCommand = new DbUpdateCommunityautomodsettingCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateCommunityautomodsetting;
