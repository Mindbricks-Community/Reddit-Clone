const PollOptionManager = require("./PollOptionManager");
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
const { dbCreatePolloption } = require("dbLayer");

class CreatePollOptionManager extends PollOptionManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createPollOption",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "pollOption";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.postId = this.postId;
    jsonObj.optionIndex = this.optionIndex;
    jsonObj.optionText = this.optionText;
    jsonObj.voteCount = this.voteCount;
  }

  readRestParameters(request) {
    this.postId = request.body?.postId;
    this.optionIndex = request.body?.optionIndex;
    this.optionText = request.body?.optionText;
    this.voteCount = request.body?.voteCount;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.postId = request.mcpParams.postId;
    this.optionIndex = request.mcpParams.optionIndex;
    this.optionText = request.mcpParams.optionText;
    this.voteCount = request.mcpParams.voteCount;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.postId == null) {
      throw new BadRequestError("errMsg_postIdisRequired");
    }

    if (this.optionIndex == null) {
      throw new BadRequestError("errMsg_optionIndexisRequired");
    }

    if (this.optionText == null) {
      throw new BadRequestError("errMsg_optionTextisRequired");
    }

    if (this.voteCount == null) {
      throw new BadRequestError("errMsg_voteCountisRequired");
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

    this.isOwner = this.pollOption?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreatePolloption function to create the polloption and return the result to the controller
    const polloption = await dbCreatePolloption(this);

    return polloption;
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.pollOptionId = this.id;
    if (!this.pollOptionId) this.pollOptionId = newUUID(false);

    const dataClause = {
      id: this.pollOptionId,
      postId: this.postId,
      optionIndex: this.optionIndex,
      optionText: this.optionText,
      voteCount: this.voteCount,
    };

    return dataClause;
  }
}

module.exports = CreatePollOptionManager;
