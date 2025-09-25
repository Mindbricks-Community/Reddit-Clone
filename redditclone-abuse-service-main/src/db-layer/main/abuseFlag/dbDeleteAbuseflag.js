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

const {
  getIdListOfAbuseInvestigationByField,
  updateAbuseInvestigationById,
  deleteAbuseInvestigationById,
} = require("../abuseInvestigation");

const { AbuseFlagQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteSequelizeCommand } = require("dbCommand");

class DbDeleteAbuseflagCommand extends DBSoftDeleteSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, AbuseFlag, instanceMode);
    this.commandName = "dbDeleteAbuseflag";
    this.nullResult = false;
    this.objectName = "abuseFlag";
    this.serviceLabel = "redditclone-abuse-service";
    this.dbEvent = "redditclone-abuse-service-dbevent-abuseflag-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
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
      const idList_AbuseInvestigation_relatedFlagIds_investigatedFlags =
        await getIdListOfAbuseInvestigationByField(
          "relatedFlagIds",
          this.dbData.id,
          false,
        );
      for (const itemId of idList_AbuseInvestigation_relatedFlagIds_investigatedFlags) {
        promises.push(
          updateAbuseInvestigationById(itemId, { relatedFlagIds: null }),
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
            "Single Error when synching delete of AbuseFlag on joined and parent objects:",
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
        "Total Error when synching delete of AbuseFlag on joined and parent objects:",
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

const dbDeleteAbuseflag = async (input) => {
  input.id = input.abuseFlagId;
  const dbDeleteCommand = new DbDeleteAbuseflagCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteAbuseflag;
