const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { LocalizationKey } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const {
  getIdListOfLocalizationStringByField,
  updateLocalizationStringById,
  deleteLocalizationStringById,
} = require("../localizationString");

const {
  LocalizationKeyQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteSequelizeCommand } = require("dbCommand");

class DbDeleteLocalizationkeyCommand extends DBSoftDeleteSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, LocalizationKey, instanceMode);
    this.commandName = "dbDeleteLocalizationkey";
    this.nullResult = false;
    this.objectName = "localizationKey";
    this.serviceLabel = "redditclone-localization-service";
    this.dbEvent =
      "redditclone-localization-service-dbevent-localizationkey-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new LocalizationKeyQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "localizationKey",
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
      const idList_LocalizationString_keyId_key =
        await getIdListOfLocalizationStringByField(
          "keyId",
          this.dbData.id,
          false,
        );
      for (const itemId of idList_LocalizationString_keyId_key) {
        promises.push(deleteLocalizationStringById(itemId));
      }

      // update childs

      // delete & update parents ???

      // delete and update referred parents

      const results = await Promise.allSettled(promises);
      for (const result of results) {
        if (result instanceof Error) {
          console.log(
            "Single Error when synching delete of LocalizationKey on joined and parent objects:",
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
        "Total Error when synching delete of LocalizationKey on joined and parent objects:",
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

const dbDeleteLocalizationkey = async (input) => {
  input.id = input.localizationKeyId;
  const dbDeleteCommand = new DbDeleteLocalizationkeyCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteLocalizationkey;
