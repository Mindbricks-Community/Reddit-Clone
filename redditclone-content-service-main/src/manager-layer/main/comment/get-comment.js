const CommentManager = require("./CommentManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbGetComment } = require("dbLayer");

class GetCommentManager extends CommentManager {
  constructor(request, controllerType) {
    super(request, {
      name: "getComment",
      controllerType: controllerType,
      pagination: false,
      crudType: "get",
      loginRequired: false,
      hasShareToken: false,
    });

    this.dataName = "comment";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.commentId = this.commentId;
  }

  readRestParameters(request) {
    this.commentId = request.params?.commentId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.commentId = request.mcpParams.commentId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.commentId == null) {
      throw new BadRequestError("errMsg_commentIdisRequired");
    }

    // ID
    if (
      this.commentId &&
      !isValidObjectId(this.commentId) &&
      !isValidUUID(this.commentId)
    ) {
      throw new BadRequestError("errMsg_commentIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.comment?.userId === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbGetComment function to get the comment and return the result to the controller
    const comment = await dbGetComment(this);

    return comment;
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
}

module.exports = GetCommentManager;
