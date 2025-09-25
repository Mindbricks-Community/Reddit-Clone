const VoteManager = require("./VoteManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const { VoteCreatedPublisher } = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbCreateVote } = require("dbLayer");

class CreateVoteManager extends VoteManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createVote",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "vote";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.userId = this.userId;
    jsonObj.postId = this.postId;
    jsonObj.commentId = this.commentId;
    jsonObj.voteType = this.voteType;
  }

  readRestParameters(request) {
    this.userId = request.session?.userId;
    this.postId = request.body?.postId;
    this.commentId = request.body?.commentId;
    this.voteType = request.body?.voteType;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.userId = request.session.userId;
    this.postId = request.mcpParams.postId;
    this.commentId = request.mcpParams.commentId;
    this.voteType = request.mcpParams.voteType;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.userId == null) {
      throw new BadRequestError("errMsg_userIdisRequired");
    }

    if (this.voteType == null) {
      throw new BadRequestError("errMsg_voteTypeisRequired");
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

    this.isOwner = this.vote?.userId === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateVote function to create the vote and return the result to the controller
    const vote = await dbCreateVote(this);

    return vote;
  }

  async raiseEvent() {
    VoteCreatedPublisher.Publish(this.output, this.session).catch((err) => {
      console.log("Publisher Error in Rest Controller:", err);
    });
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.voteId = this.id;
    if (!this.voteId) this.voteId = newUUID(false);

    const dataClause = {
      id: this.voteId,
      userId: this.userId,
      postId: this.postId,
      commentId: this.commentId,
      voteType: this.voteType,
    };

    return dataClause;
  }
}

module.exports = CreateVoteManager;
