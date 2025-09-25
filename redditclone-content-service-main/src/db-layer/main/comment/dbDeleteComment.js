const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { Comment } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const {
  getIdListOfCommentByField,
  updateCommentById,
  deleteCommentById,
} = require("../comment");

const { CommentQueryCacheInvalidator } = require("./query-cache-classes");
const { CommentEntityCache } = require("./entity-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteSequelizeCommand } = require("dbCommand");

class DbDeleteCommentCommand extends DBSoftDeleteSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, Comment, instanceMode);
    this.commandName = "dbDeleteComment";
    this.nullResult = false;
    this.objectName = "comment";
    this.serviceLabel = "redditclone-content-service";
    this.dbEvent = "redditclone-content-service-dbevent-comment-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new CommentQueryCacheInvalidator();
  }

  createEntityCacher() {
    super.createEntityCacher();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "comment",
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
      const idList_Vote_commentId_voteForComment = await getIdListOfVoteByField(
        "commentId",
        this.dbData.id,
        false,
      );
      for (const itemId of idList_Vote_commentId_voteForComment) {
        promises.push(deleteVoteById(itemId));
      }

      const idList_PostMedia_commentId_mediaForComment =
        await getIdListOfPostMediaByField("commentId", this.dbData.id, false);
      for (const itemId of idList_PostMedia_commentId_mediaForComment) {
        promises.push(deletePostMediaById(itemId));
      }

      // update childs
      const idList_Comment_parentCommentId_parentComment =
        await getIdListOfCommentByField(
          "parentCommentId",
          this.dbData.id,
          false,
        );
      for (const itemId of idList_Comment_parentCommentId_parentComment) {
        promises.push(updateCommentById(itemId, { parentCommentId: null }));
      }

      // delete & update parents ???

      // delete and update referred parents

      const results = await Promise.allSettled(promises);
      for (const result of results) {
        if (result instanceof Error) {
          console.log(
            "Single Error when synching delete of Comment on joined and parent objects:",
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
        "Total Error when synching delete of Comment on joined and parent objects:",
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

const dbDeleteComment = async (input) => {
  input.id = input.commentId;
  const dbDeleteCommand = new DbDeleteCommentCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteComment;
