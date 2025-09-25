const PostManager = require("./PostManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const { PostCreatedPublisher } = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbCreatePost } = require("dbLayer");

class CreatePostManager extends PostManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createPost",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "post";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.communityId = this.communityId;
    jsonObj.userId = this.userId;
    jsonObj.title = this.title;
    jsonObj.bodyText = this.bodyText;
    jsonObj.externalUrl = this.externalUrl;
    jsonObj.postType = this.postType;
    jsonObj.status = this.status;
    jsonObj.isNsfw = this.isNsfw;
    jsonObj.upVotes = this.upVotes;
    jsonObj.downVotes = this.downVotes;
  }

  readRestParameters(request) {
    this.communityId = request.body?.communityId;
    this.userId = request.session?.userId;
    this.title = request.body?.title;
    this.bodyText = request.body?.bodyText;
    this.externalUrl = request.body?.externalUrl;
    this.postType = request.body?.postType;
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
    this.communityId = request.mcpParams.communityId;
    this.userId = request.session.userId;
    this.title = request.mcpParams.title;
    this.bodyText = request.mcpParams.bodyText;
    this.externalUrl = request.mcpParams.externalUrl;
    this.postType = request.mcpParams.postType;
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
    if (this.communityId == null) {
      throw new BadRequestError("errMsg_communityIdisRequired");
    }

    if (this.userId == null) {
      throw new BadRequestError("errMsg_userIdisRequired");
    }

    if (this.postType == null) {
      throw new BadRequestError("errMsg_postTypeisRequired");
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
      this.communityId &&
      !isValidObjectId(this.communityId) &&
      !isValidUUID(this.communityId)
    ) {
      throw new BadRequestError("errMsg_communityIdisNotAValidID");
    }

    // ID
    if (
      this.userId &&
      !isValidObjectId(this.userId) &&
      !isValidUUID(this.userId)
    ) {
      throw new BadRequestError("errMsg_userIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.post?.userId === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreatePost function to create the post and return the result to the controller
    const post = await dbCreatePost(this);

    return post;
  }

  async raiseEvent() {
    PostCreatedPublisher.Publish(this.output, this.session).catch((err) => {
      console.log("Publisher Error in Rest Controller:", err);
    });
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.postId = this.id;
    if (!this.postId) this.postId = newUUID(false);

    const dataClause = {
      id: this.postId,
      communityId: this.communityId,
      userId: this.userId,
      title: this.title,
      bodyText: this.bodyText,
      externalUrl: this.externalUrl,
      postType: this.postType,
      status: this.status,
      isNsfw: this.isNsfw,
      upVotes: this.upVotes,
      downVotes: this.downVotes,
    };

    return dataClause;
  }
}

module.exports = CreatePostManager;
