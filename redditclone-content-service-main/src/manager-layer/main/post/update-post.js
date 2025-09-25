const PostManager = require("./PostManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const { PostUpdatedPublisher } = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbUpdatePost } = require("dbLayer");

class UpdatePostManager extends PostManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updatePost",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "post";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.postId = this.postId;
    jsonObj.title = this.title;
    jsonObj.bodyText = this.bodyText;
    jsonObj.externalUrl = this.externalUrl;
    jsonObj.postType = this.postType;
    jsonObj.status = this.status;
    jsonObj.isNsfw = this.isNsfw;
  }

  readRestParameters(request) {
    this.postId = request.params?.postId;
    this.title = request.body?.title;
    this.bodyText = request.body?.bodyText;
    this.externalUrl = request.body?.externalUrl;
    this.postType = request.body?.postType;
    this.status = request.body?.status;
    this.isNsfw = request.body?.isNsfw;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.postId = request.mcpParams.postId;
    this.title = request.mcpParams.title;
    this.bodyText = request.mcpParams.bodyText;
    this.externalUrl = request.mcpParams.externalUrl;
    this.postType = request.mcpParams.postType;
    this.status = request.mcpParams.status;
    this.isNsfw = request.mcpParams.isNsfw;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getPostById } = require("dbLayer");
    this.post = await getPostById(this.postId);
    if (!this.post) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.postId == null) {
      throw new BadRequestError("errMsg_postIdisRequired");
    }

    // ID
    if (
      this.postId &&
      !isValidObjectId(this.postId) &&
      !isValidUUID(this.postId)
    ) {
      throw new BadRequestError("errMsg_postIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.post?.userId === this.session.userId;
  }

  async checkLayer3AuthValidations() {
    // check ownership of the record agianst the session user
    if (!this.isOwner) {
      throw new ForbiddenError("errMsg_postCanBeAccessedByOwner");
    }

    //check "403" validations
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbUpdatePost function to update the post and return the result to the controller
    const post = await dbUpdatePost(this);

    return post;
  }

  async raiseEvent() {
    PostUpdatedPublisher.Publish(this.output, this.session).catch((err) => {
      console.log("Publisher Error in Rest Controller:", err);
    });
  }

  async getRouteQuery() {
    return { $and: [{ id: this.postId }, { isActive: true }] };

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
      title: this.title,
      bodyText: this.bodyText,
      externalUrl: this.externalUrl,
      postType: this.postType,
      status: this.status,
      isNsfw: this.isNsfw,
    };

    return dataClause;
  }
}

module.exports = UpdatePostManager;
