const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { Post } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const {
  getIdListOfCommentByField,
  updateCommentById,
  deleteCommentById,
} = require("../comment");

const { PostQueryCacheInvalidator } = require("./query-cache-classes");
const { PostEntityCache } = require("./entity-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteSequelizeCommand } = require("dbCommand");

class DbDeletePostCommand extends DBSoftDeleteSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, Post, instanceMode);
    this.commandName = "dbDeletePost";
    this.nullResult = false;
    this.objectName = "post";
    this.serviceLabel = "redditclone-content-service";
    this.dbEvent = "redditclone-content-service-dbevent-post-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new PostQueryCacheInvalidator();
  }

  createEntityCacher() {
    super.createEntityCacher();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "post",
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
      const idList_Comment_postId_commentOnPost =
        await getIdListOfCommentByField("postId", this.dbData.id, false);
      for (const itemId of idList_Comment_postId_commentOnPost) {
        promises.push(deleteCommentById(itemId));
      }

      const idList_Vote_postId_voteForPost = await getIdListOfVoteByField(
        "postId",
        this.dbData.id,
        false,
      );
      for (const itemId of idList_Vote_postId_voteForPost) {
        promises.push(deleteVoteById(itemId));
      }

      const idList_PollOption_postId_pollForPost =
        await getIdListOfPollOptionByField("postId", this.dbData.id, false);
      for (const itemId of idList_PollOption_postId_pollForPost) {
        promises.push(deletePollOptionById(itemId));
      }

      const idList_PostMedia_postId_mediaForPost =
        await getIdListOfPostMediaByField("postId", this.dbData.id, false);
      for (const itemId of idList_PostMedia_postId_mediaForPost) {
        promises.push(deletePostMediaById(itemId));
      }

      // update childs

      // delete & update parents ???

      // delete and update referred parents

      const results = await Promise.allSettled(promises);
      for (const result of results) {
        if (result instanceof Error) {
          console.log(
            "Single Error when synching delete of Post on joined and parent objects:",
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
        "Total Error when synching delete of Post on joined and parent objects:",
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

const dbDeletePost = async (input) => {
  input.id = input.postId;
  const dbDeleteCommand = new DbDeletePostCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeletePost;
