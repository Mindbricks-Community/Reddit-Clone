const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { Community } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const {
  getIdListOfCommunityMemberByField,
  updateCommunityMemberById,
  deleteCommunityMemberById,
} = require("../communityMember");

const { CommunityQueryCacheInvalidator } = require("./query-cache-classes");
const { CommunityEntityCache } = require("./entity-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteSequelizeCommand } = require("dbCommand");

class DbDeleteCommunityCommand extends DBSoftDeleteSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, Community, instanceMode);
    this.commandName = "dbDeleteCommunity";
    this.nullResult = false;
    this.objectName = "community";
    this.serviceLabel = "redditclone-community-service";
    this.dbEvent = "redditclone-community-service-dbevent-community-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new CommunityQueryCacheInvalidator();
  }

  createEntityCacher() {
    super.createEntityCacher();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "community",
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
      const idList_CommunityMember_communityId_community =
        await getIdListOfCommunityMemberByField(
          "communityId",
          this.dbData.id,
          false,
        );
      for (const itemId of idList_CommunityMember_communityId_community) {
        promises.push(deleteCommunityMemberById(itemId));
      }

      const idList_CommunityRule_communityId_community =
        await getIdListOfCommunityRuleByField(
          "communityId",
          this.dbData.id,
          false,
        );
      for (const itemId of idList_CommunityRule_communityId_community) {
        promises.push(deleteCommunityRuleById(itemId));
      }

      const idList_CommunityPinned_communityId_community =
        await getIdListOfCommunityPinnedByField(
          "communityId",
          this.dbData.id,
          false,
        );
      for (const itemId of idList_CommunityPinned_communityId_community) {
        promises.push(deleteCommunityPinnedById(itemId));
      }

      const idList_CommunityAutomodSetting_communityId_community =
        await getIdListOfCommunityAutomodSettingByField(
          "communityId",
          this.dbData.id,
          false,
        );
      for (const itemId of idList_CommunityAutomodSetting_communityId_community) {
        promises.push(deleteCommunityAutomodSettingById(itemId));
      }

      // update childs

      // delete & update parents ???

      // delete and update referred parents

      const results = await Promise.allSettled(promises);
      for (const result of results) {
        if (result instanceof Error) {
          console.log(
            "Single Error when synching delete of Community on joined and parent objects:",
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
        "Total Error when synching delete of Community on joined and parent objects:",
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

const dbDeleteCommunity = async (input) => {
  input.id = input.communityId;
  const dbDeleteCommand = new DbDeleteCommunityCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteCommunity;
