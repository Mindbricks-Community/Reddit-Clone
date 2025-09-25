const AbuseFlagManager = require("./AbuseFlagManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const { AbuseflagCreatedPublisher } = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbCreateAbuseflag } = require("dbLayer");

class CreateAbuseFlagManager extends AbuseFlagManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createAbuseFlag",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "abuseFlag";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.flagType = this.flagType;
    jsonObj.flagStatus = this.flagStatus;
    jsonObj.postId = this.postId;
    jsonObj.commentId = this.commentId;
    jsonObj.userId = this.userId;
    jsonObj.mediaObjectId = this.mediaObjectId;
    jsonObj.origin = this.origin;
    jsonObj.details = this.details;
  }

  readRestParameters(request) {
    this.flagType = request.body?.flagType;
    this.flagStatus = request.body?.flagStatus;
    this.postId = request.body?.postId;
    this.commentId = request.body?.commentId;
    this.userId = request.body?.userId;
    this.mediaObjectId = request.body?.mediaObjectId;
    this.origin = request.body?.origin;
    this.details = request.body?.details;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.flagType = request.mcpParams.flagType;
    this.flagStatus = request.mcpParams.flagStatus;
    this.postId = request.mcpParams.postId;
    this.commentId = request.mcpParams.commentId;
    this.userId = request.mcpParams.userId;
    this.mediaObjectId = request.mcpParams.mediaObjectId;
    this.origin = request.mcpParams.origin;
    this.details = request.mcpParams.details;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.flagType == null) {
      throw new BadRequestError("errMsg_flagTypeisRequired");
    }

    if (this.flagStatus == null) {
      throw new BadRequestError("errMsg_flagStatusisRequired");
    }

    if (this.origin == null) {
      throw new BadRequestError("errMsg_originisRequired");
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
      this.mediaObjectId &&
      !isValidObjectId(this.mediaObjectId) &&
      !isValidUUID(this.mediaObjectId)
    ) {
      throw new BadRequestError("errMsg_mediaObjectIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.abuseFlag?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateAbuseflag function to create the abuseflag and return the result to the controller
    const abuseflag = await dbCreateAbuseflag(this);

    return abuseflag;
  }

  async raiseEvent() {
    AbuseflagCreatedPublisher.Publish(this.output, this.session).catch(
      (err) => {
        console.log("Publisher Error in Rest Controller:", err);
      },
    );
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.abuseFlagId = this.id;
    if (!this.abuseFlagId) this.abuseFlagId = newUUID(false);

    const dataClause = {
      id: this.abuseFlagId,
      flagType: this.flagType,
      flagStatus: this.flagStatus,
      postId: this.postId,
      commentId: this.commentId,
      userId: this.userId,
      mediaObjectId: this.mediaObjectId,
      origin: this.origin,
      details: this.details
        ? typeof this.details == "string"
          ? JSON.parse(this.details)
          : this.details
        : null,
    };

    return dataClause;
  }
}

module.exports = CreateAbuseFlagManager;
