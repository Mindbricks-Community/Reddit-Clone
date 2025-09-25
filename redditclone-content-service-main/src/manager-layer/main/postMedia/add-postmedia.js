const PostMediaManager = require("./PostMediaManager");
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
const { dbAddPostmedia } = require("dbLayer");

class AddPostMediaManager extends PostMediaManager {
  constructor(request, controllerType) {
    super(request, {
      name: "addPostMedia",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "postMedia";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.mediaObjectId = this.mediaObjectId;
    jsonObj.postId = this.postId;
    jsonObj.commentId = this.commentId;
    jsonObj.mediaIndex = this.mediaIndex;
    jsonObj.caption = this.caption;
  }

  readRestParameters(request) {
    this.mediaObjectId = request.body?.mediaObjectId;
    this.postId = request.body?.postId;
    this.commentId = request.body?.commentId;
    this.mediaIndex = request.body?.mediaIndex;
    this.caption = request.body?.caption;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.mediaObjectId = request.mcpParams.mediaObjectId;
    this.postId = request.mcpParams.postId;
    this.commentId = request.mcpParams.commentId;
    this.mediaIndex = request.mcpParams.mediaIndex;
    this.caption = request.mcpParams.caption;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.mediaObjectId == null) {
      throw new BadRequestError("errMsg_mediaObjectIdisRequired");
    }

    if (this.mediaIndex == null) {
      throw new BadRequestError("errMsg_mediaIndexisRequired");
    }

    // ID
    if (
      this.mediaObjectId &&
      !isValidObjectId(this.mediaObjectId) &&
      !isValidUUID(this.mediaObjectId)
    ) {
      throw new BadRequestError("errMsg_mediaObjectIdisNotAValidID");
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

    this.isOwner = this.postMedia?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbAddPostmedia function to create the postmedia and return the result to the controller
    const postmedia = await dbAddPostmedia(this);

    return postmedia;
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.postMediaId = this.id;
    if (!this.postMediaId) this.postMediaId = newUUID(false);

    const dataClause = {
      id: this.postMediaId,
      mediaObjectId: this.mediaObjectId,
      postId: this.postId,
      commentId: this.commentId,
      mediaIndex: this.mediaIndex,
      caption: this.caption,
    };

    return dataClause;
  }
}

module.exports = AddPostMediaManager;
