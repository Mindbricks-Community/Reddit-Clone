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

const { DBCreateSequelizeCommand } = require("dbCommand");

const {
  CommunityMemberQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getCommunityMemberById = require("./utils/getCommunityMemberById");

class DbCreateCommunitymemberCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateCommunitymember";
    this.objectName = "communityMember";
    this.serviceLabel = "redditclone-community-service";
    this.dbEvent =
      "redditclone-community-service-dbevent-communitymember-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
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

  // should i add hooksDbLayer here?

  // ask about this should i rename the whereClause to dataClause???

  async create_childs() {}

  async transposeResult() {
    // transpose dbData
  }

  async runDbCommand() {
    await super.runDbCommand();

    let communityMember = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        communityId: this.dataClause.communityId,
        userId: this.dataClause.userId,
      };

      communityMember =
        communityMember ||
        (await CommunityMember.findOne({ where: whereClause }));

      if (communityMember) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" + "communityId-userId",
        );
      }

      if (!updated && this.dataClause.id && !exists) {
        communityMember =
          communityMember ||
          (await CommunityMember.findByPk(this.dataClause.id));
        if (communityMember) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await communityMember.update(this.dataClause);
          updated = true;
        }
      }
    } catch (error) {
      const eDetail = {
        whereClause: this.normalizeSequalizeOps(whereClause),
        dataClause: this.dataClause,
        errorStack: error.stack,
        checkoutResult: this.input.checkoutResult,
      };
      throw new HttpServerError(
        "Error in checking unique index when creating CommunityMember",
        eDetail,
      );
    }

    if (!updated && !exists) {
      communityMember = await CommunityMember.create(this.dataClause);
    }

    this.dbData = communityMember.getData();
    this.input.communityMember = this.dbData;
    await this.create_childs();
  }
}

const dbCreateCommunitymember = async (input) => {
  const dbCreateCommand = new DbCreateCommunitymemberCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateCommunitymember;
