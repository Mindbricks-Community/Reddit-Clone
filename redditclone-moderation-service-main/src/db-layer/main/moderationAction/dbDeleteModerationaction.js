const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { ModerationAction } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const {
  getIdListOfModerationAuditLogByField,
  updateModerationAuditLogById,
  deleteModerationAuditLogById,
} = require("../moderationAuditLog");

const {
  ModerationActionQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteSequelizeCommand } = require("dbCommand");

class DbDeleteModerationactionCommand extends DBSoftDeleteSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, ModerationAction, instanceMode);
    this.commandName = "dbDeleteModerationaction";
    this.nullResult = false;
    this.objectName = "moderationAction";
    this.serviceLabel = "redditclone-moderation-service";
    this.dbEvent =
      "redditclone-moderation-service-dbevent-moderationaction-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new ModerationActionQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "moderationAction",
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
      const idList_ModerationAuditLog_linkedModerationActionId_moderationAction =
        await getIdListOfModerationAuditLogByField(
          "linkedModerationActionId",
          this.dbData.id,
          false,
        );
      for (const itemId of idList_ModerationAuditLog_linkedModerationActionId_moderationAction) {
        promises.push(
          updateModerationAuditLogById(itemId, {
            linkedModerationActionId: null,
          }),
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
            "Single Error when synching delete of ModerationAction on joined and parent objects:",
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
        "Total Error when synching delete of ModerationAction on joined and parent objects:",
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

const dbDeleteModerationaction = async (input) => {
  input.id = input.moderationActionId;
  const dbDeleteCommand = new DbDeleteModerationactionCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteModerationaction;
