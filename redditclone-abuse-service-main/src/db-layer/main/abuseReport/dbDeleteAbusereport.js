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

const {
  getIdListOfAbuseInvestigationByField,
  updateAbuseInvestigationById,
  deleteAbuseInvestigationById,
} = require("../abuseInvestigation");

const { AbuseReportQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteSequelizeCommand } = require("dbCommand");

class DbDeleteAbusereportCommand extends DBSoftDeleteSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, AbuseReport, instanceMode);
    this.commandName = "dbDeleteAbusereport";
    this.nullResult = false;
    this.objectName = "abuseReport";
    this.serviceLabel = "redditclone-abuse-service";
    this.dbEvent = "redditclone-abuse-service-dbevent-abusereport-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
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
    await elasticIndexer.deleteData(this.dbData.id);
  }

  //should i add this here?

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    // transpose dbData
  }

  async syncJoins() {
    const promises = [];
    const dataId = this.dbData.id;
    // relationTargetKey should be used instead of id
    try {
      // delete refrring objects

      // update referring objects
      const idList_AbuseInvestigation_relatedReportIds_investigatedReports =
        await getIdListOfAbuseInvestigationByField(
          "relatedReportIds",
          this.dbData.id,
          false,
        );
      for (const itemId of idList_AbuseInvestigation_relatedReportIds_investigatedReports) {
        promises.push(
          updateAbuseInvestigationById(itemId, { relatedReportIds: null }),
        );
      }

      // delete childs

      // update childs

      // delete & update parents ???

      // delete and update referred parents

      const results = await Promise.allSettled(promises);
      for (const result of results) {
        if (result instanceof Error) {
          console.log(
            "Single Error when synching delete of AbuseReport on joined and parent objects:",
            dataId,
            result,
          );
          hexaLogger.insertError(
            "SyncJoinError",
            { function: "syncJoins", dataId: dataId },
            "->syncJoins",
            result,
          );
        }
      }
    } catch (err) {
      console.log(
        "Total Error when synching delete of AbuseReport on joined and parent objects:",
        dataId,
        err,
      );
      hexaLogger.insertError(
        "SyncJoinsTotalError",
        { function: "syncJoins", dataId: dataId },
        "->syncJoins",
        err,
      );
    }
  }
}

const dbDeleteAbusereport = async (input) => {
  input.id = input.abuseReportId;
  const dbDeleteCommand = new DbDeleteAbusereportCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteAbusereport;
