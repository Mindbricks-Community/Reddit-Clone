const PostManager = require("./PostManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const { PostDeletedPublisher } = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbDeletePost } = require("dbLayer");

class DeletePostManager extends PostManager {
  constructor(request, controllerType) {
    super(request, {
      name: "deletePost",
      controllerType: controllerType,
      pagination: false,
      crudType: "delete",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "post";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.postId = this.postId;
  }

  readRestParameters(request) {
    this.postId = request.params?.postId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.postId = request.mcpParams.postId;
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
    // make an awaited call to the dbDeletePost function to delete the post and return the result to the controller
    const post = await dbDeletePost(this);

    return post;
  }

  async raiseEvent() {
    PostDeletedPublisher.Publish(this.output, this.session).catch((err) => {
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
}

module.exports = DeletePostManager;
