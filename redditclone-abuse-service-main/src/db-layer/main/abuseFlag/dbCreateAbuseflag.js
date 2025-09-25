const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { AbuseFlag } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { DBCreateSequelizeCommand } = require("dbCommand");

const { AbuseFlagQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getAbuseFlagById = require("./utils/getAbuseFlagById");

class DbCreateAbuseflagCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateAbuseflag";
    this.objectName = "abuseFlag";
    this.serviceLabel = "redditclone-abuse-service";
    this.dbEvent = "redditclone-abuse-service-dbevent-abuseflag-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new AbuseFlagQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "abuseFlag",
      this.session,
      this.requestId,
    );
    const dbData = await getAbuseFlagById(this.dbData.id);
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

    let abuseFlag = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        flagType: this.dataClause.flagType,
        postId: this.dataClause.postId,
        commentId: this.dataClause.commentId,
        userId: this.dataClause.userId,
        mediaObjectId: this.dataClause.mediaObjectId,
      };

      abuseFlag =
        abuseFlag || (await AbuseFlag.findOne({ where: whereClause }));

      if (abuseFlag) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" +
            "flagType-postId-commentId-userId-mediaObjectId",
        );
      }

      if (!updated && this.dataClause.id && !exists) {
        abuseFlag = abuseFlag || (await AbuseFlag.findByPk(this.dataClause.id));
        if (abuseFlag) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await abuseFlag.update(this.dataClause);
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
        "Error in checking unique index when creating AbuseFlag",
        eDetail,
      );
    }

    if (!updated && !exists) {
      abuseFlag = await AbuseFlag.create(this.dataClause);
    }

    this.dbData = abuseFlag.getData();
    this.input.abuseFlag = this.dbData;
    await this.create_childs();
  }
}

const dbCreateAbuseflag = async (input) => {
  const dbCreateCommand = new DbCreateAbuseflagCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateAbuseflag;
