const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { MediaObject } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const {
  getIdListOfMediaScanByField,
  updateMediaScanById,
  deleteMediaScanById,
} = require("../mediaScan");

const { MediaObjectQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteSequelizeCommand } = require("dbCommand");

class DbDeleteMediaobjectCommand extends DBSoftDeleteSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, MediaObject, instanceMode);
    this.commandName = "dbDeleteMediaobject";
    this.nullResult = false;
    this.objectName = "mediaObject";
    this.serviceLabel = "redditclone-media-service";
    this.dbEvent = "redditclone-media-service-dbevent-mediaobject-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new MediaObjectQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "mediaObject",
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

      // delete childs

      // update childs
      const idList_MediaScan_mediaObjectId_mediaObject =
        await getIdListOfMediaScanByField(
          "mediaObjectId",
          this.dbData.id,
          false,
        );
      for (const itemId of idList_MediaScan_mediaObjectId_mediaObject) {
        promises.push(updateMediaScanById(itemId, { mediaObjectId: null }));
      }

      // delete & update parents ???

      // delete and update referred parents

      const results = await Promise.allSettled(promises);
      for (const result of results) {
        if (result instanceof Error) {
          console.log(
            "Single Error when synching delete of MediaObject on joined and parent objects:",
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
        "Total Error when synching delete of MediaObject on joined and parent objects:",
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

const dbDeleteMediaobject = async (input) => {
  input.id = input.mediaObjectId;
  const dbDeleteCommand = new DbDeleteMediaobjectCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteMediaobject;
