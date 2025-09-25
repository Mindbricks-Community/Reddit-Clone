const CommentManager = require("./CommentManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const { CommentUpdatedPublisher } = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbUpdateComment } = require("dbLayer");

class UpdateCommentManager extends CommentManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateComment",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "comment";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.commentId = this.commentId;
    jsonObj.parentCommentId = this.parentCommentId;
    jsonObj.threadPath = this.threadPath;
    jsonObj.bodyText = this.bodyText;
    jsonObj.status = this.status;
    jsonObj.isNsfw = this.isNsfw;
  }

  readRestParameters(request) {
    this.commentId = request.params?.commentId;
    this.parentCommentId = request.body?.parentCommentId;
    this.threadPath = request.body?.threadPath;
    this.bodyText = request.body?.bodyText;
    this.status = request.body?.status;
    this.isNsfw = request.body?.isNsfw;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.commentId = request.mcpParams.commentId;
    this.parentCommentId = request.mcpParams.parentCommentId;
    this.threadPath = request.mcpParams.threadPath;
    this.bodyText = request.mcpParams.bodyText;
    this.status = request.mcpParams.status;
    this.isNsfw = request.mcpParams.isNsfw;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getCommentById } = require("dbLayer");
    this.comment = await getCommentById(this.commentId);
    if (!this.comment) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.commentId == null) {
      throw new BadRequestError("errMsg_commentIdisRequired");
    }

    if (this.bodyText == null) {
      throw new BadRequestError("errMsg_bodyTextisRequired");
    }

    // ID
    if (
      this.commentId &&
      !isValidObjectId(this.commentId) &&
      !isValidUUID(this.commentId)
    ) {
      throw new BadRequestError("errMsg_commentIdisNotAValidID");
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

  async checkLayer3AuthValidations() {
    // check ownership of the record agianst the session user
    if (!this.isOwner) {
      throw new ForbiddenError("errMsg_commentCanBeAccessedByOwner");
    }

    //check "403" validations
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbUpdateComment function to update the comment and return the result to the controller
    const comment = await dbUpdateComment(this);

    return comment;
  }

  async raiseEvent() {
    CommentUpdatedPublisher.Publish(this.output, this.session).catch((err) => {
      console.log("Publisher Error in Rest Controller:", err);
    });
  }

  async getRouteQuery() {
    return { $and: [{ id: this.commentId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }

  async getDataClause() {
    const { hashString } = require("common");

    const dataClause = {
      parentCommentId: this.parentCommentId,
      threadPath: this.threadPath,
      bodyText: this.bodyText,
      status: this.status,
      isNsfw: this.isNsfw,
    };

    return dataClause;
  }
}

module.exports = UpdateCommentManager;
