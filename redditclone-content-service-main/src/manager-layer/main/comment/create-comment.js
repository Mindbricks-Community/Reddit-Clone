const CommentManager = require("./CommentManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const { CommentCreatedPublisher } = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbCreateComment } = require("dbLayer");

class CreateCommentManager extends CommentManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createComment",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "comment";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.postId = this.postId;
    jsonObj.userId = this.userId;
    jsonObj.parentCommentId = this.parentCommentId;
    jsonObj.threadPath = this.threadPath;
    jsonObj.bodyText = this.bodyText;
    jsonObj.status = this.status;
    jsonObj.isNsfw = this.isNsfw;
    jsonObj.upVotes = this.upVotes;
    jsonObj.downVotes = this.downVotes;
  }

  readRestParameters(request) {
    this.postId = request.body?.postId;
    this.userId = request.session?.userId;
    this.parentCommentId = request.body?.parentCommentId;
    this.threadPath = request.body?.threadPath;
    this.bodyText = request.body?.bodyText;
    this.status = request.body?.status;
    this.isNsfw = request.body?.isNsfw;
    this.upVotes = request.body?.upVotes;
    this.downVotes = request.body?.downVotes;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.postId = request.mcpParams.postId;
    this.userId = request.session.userId;
    this.parentCommentId = request.mcpParams.parentCommentId;
    this.threadPath = request.mcpParams.threadPath;
    this.bodyText = request.mcpParams.bodyText;
    this.status = request.mcpParams.status;
    this.isNsfw = request.mcpParams.isNsfw;
    this.upVotes = request.mcpParams.upVotes;
    this.downVotes = request.mcpParams.downVotes;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.postId == null) {
      throw new BadRequestError("errMsg_postIdisRequired");
    }

    if (this.userId == null) {
      throw new BadRequestError("errMsg_userIdisRequired");
    }

    if (this.bodyText == null) {
      throw new BadRequestError("errMsg_bodyTextisRequired");
    }

    if (this.status == null) {
      throw new BadRequestError("errMsg_statusisRequired");
    }

    if (this.isNsfw == null) {
      throw new BadRequestError("errMsg_isNsfwisRequired");
    }

    if (this.upVotes == null) {
      throw new BadRequestError("errMsg_upVotesisRequired");
    }

    if (this.downVotes == null) {
      throw new BadRequestError("errMsg_downVotesisRequired");
    }

    // ID
    if (
      this.postId &&
      !isValidObjectId(this.postId) &&
      !isValidUUID(this.postId)
    ) {
      throw new BadRequestError("errMsg_postIdisNotAValidID");
    }

    // ID
    if (
      this.userId &&
      !isValidObjectId(this.userId) &&
      !isValidUUID(this.userId)
    ) {
      throw new BadRequestError("errMsg_userIdisNotAValidID");
    }

    // ID
    if (
      this.parentCommentId &&
      !isValidObjectId(this.parentCommentId) &&
      !isValidUUID(this.parentCommentId)
    ) {
      throw new BadRequestError("errMsg_parentCommentIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.comment?.userId === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateComment function to create the comment and return the result to the controller
    const comment = await dbCreateComment(this);

    return comment;
  }

  async raiseEvent() {
    CommentCreatedPublisher.Publish(this.output, this.session).catch((err) => {
      console.log("Publisher Error in Rest Controller:", err);
    });
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.commentId = this.id;
    if (!this.commentId) this.commentId = newUUID(false);

    const dataClause = {
      id: this.commentId,
      postId: this.postId,
      userId: this.userId,
      parentCommentId: this.parentCommentId,
      threadPath: this.threadPath,
      bodyText: this.bodyText,
      status: this.status,
      isNsfw: this.isNsfw,
      upVotes: this.upVotes,
      downVotes: this.downVotes,
    };

    return dataClause;
  }
}

module.exports = CreateCommentManager;
