const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { AbuseInvestigation } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { DBCreateSequelizeCommand } = require("dbCommand");

const {
  AbuseInvestigationQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getAbuseInvestigationById = require("./utils/getAbuseInvestigationById");

class DbCreateAbuseinvestigationCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateAbuseinvestigation";
    this.objectName = "abuseInvestigation";
    this.serviceLabel = "redditclone-abuse-service";
    this.dbEvent =
      "redditclone-abuse-service-dbevent-abuseinvestigation-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new AbuseInvestigationQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "abuseInvestigation",
      this.session,
      this.requestId,
    );
    const dbData = await getAbuseInvestigationById(this.dbData.id);
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

    let abuseInvestigation = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        openedByUserId: this.dataClause.openedByUserId,
        investigationStatus: this.dataClause.investigationStatus,
      };

      abuseInvestigation =
        abuseInvestigation ||
        (await AbuseInvestigation.findOne({ where: whereClause }));

      if (abuseInvestigation) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" +
            "openedByUserId-investigationStatus",
        );
      }

      if (!updated && this.dataClause.id && !exists) {
        abuseInvestigation =
          abuseInvestigation ||
          (await AbuseInvestigation.findByPk(this.dataClause.id));
        if (abuseInvestigation) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await abuseInvestigation.update(this.dataClause);
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
        "Error in checking unique index when creating AbuseInvestigation",
        eDetail,
      );
    }

    if (!updated && !exists) {
      abuseInvestigation = await AbuseInvestigation.create(this.dataClause);
    }

    this.dbData = abuseInvestigation.getData();
    this.input.abuseInvestigation = this.dbData;
    await this.create_childs();
  }
}

const dbCreateAbuseinvestigation = async (input) => {
  const dbCreateCommand = new DbCreateAbuseinvestigationCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateAbuseinvestigation;
