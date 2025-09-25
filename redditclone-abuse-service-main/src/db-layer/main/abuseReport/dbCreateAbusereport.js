const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { AbuseReport } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { DBCreateSequelizeCommand } = require("dbCommand");

const { AbuseReportQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getAbuseReportById = require("./utils/getAbuseReportById");

class DbCreateAbusereportCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateAbusereport";
    this.objectName = "abuseReport";
    this.serviceLabel = "redditclone-abuse-service";
    this.dbEvent = "redditclone-abuse-service-dbevent-abusereport-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new AbuseReportQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "abuseReport",
      this.session,
      this.requestId,
    );
    const dbData = await getAbuseReportById(this.dbData.id);
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

    let abuseReport = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        reportedUserId: this.dataClause.reportedUserId,
        postId: this.dataClause.postId,
        commentId: this.dataClause.commentId,
        reporterUserId: this.dataClause.reporterUserId,
      };

      abuseReport =
        abuseReport || (await AbuseReport.findOne({ where: whereClause }));

      if (abuseReport) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" +
            "reportedUserId-postId-commentId-reporterUserId",
        );
      }

      if (!updated && this.dataClause.id && !exists) {
        abuseReport =
          abuseReport || (await AbuseReport.findByPk(this.dataClause.id));
        if (abuseReport) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await abuseReport.update(this.dataClause);
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
        "Error in checking unique index when creating AbuseReport",
        eDetail,
      );
    }

    if (!updated && !exists) {
      abuseReport = await AbuseReport.create(this.dataClause);
    }

    this.dbData = abuseReport.getData();
    this.input.abuseReport = this.dbData;
    await this.create_childs();
  }
}

const dbCreateAbusereport = async (input) => {
  const dbCreateCommand = new DbCreateAbusereportCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateAbusereport;
