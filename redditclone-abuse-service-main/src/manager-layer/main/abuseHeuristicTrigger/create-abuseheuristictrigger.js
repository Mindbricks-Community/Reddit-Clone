const AbuseHeuristicTriggerManager = require("./AbuseHeuristicTriggerManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const {
  AbuseheuristictriggerCreatedPublisher,
} = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbCreateAbuseheuristictrigger } = require("dbLayer");

class CreateAbuseHeuristicTriggerManager extends AbuseHeuristicTriggerManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createAbuseHeuristicTrigger",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: false,
      hasShareToken: false,
    });

    this.dataName = "abuseHeuristicTrigger";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.triggerType = this.triggerType;
    jsonObj.userId = this.userId;
    jsonObj.ipAddress = this.ipAddress;
    jsonObj.targetId = this.targetId;
    jsonObj.details = this.details;
  }

  readRestParameters(request) {
    this.triggerType = request.body?.triggerType;
    this.userId = request.body?.userId;
    this.ipAddress = request.body?.ipAddress;
    this.targetId = request.body?.targetId;
    this.details = request.body?.details;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.triggerType = request.mcpParams.triggerType;
    this.userId = request.mcpParams.userId;
    this.ipAddress = request.mcpParams.ipAddress;
    this.targetId = request.mcpParams.targetId;
    this.details = request.mcpParams.details;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.triggerType == null) {
      throw new BadRequestError("errMsg_triggerTypeisRequired");
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
      this.targetId &&
      !isValidObjectId(this.targetId) &&
      !isValidUUID(this.targetId)
    ) {
      throw new BadRequestError("errMsg_targetIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.abuseHeuristicTrigger?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateAbuseheuristictrigger function to create the abuseheuristictrigger and return the result to the controller
    const abuseheuristictrigger = await dbCreateAbuseheuristictrigger(this);

    return abuseheuristictrigger;
  }

  async raiseEvent() {
    AbuseheuristictriggerCreatedPublisher.Publish(
      this.output,
      this.session,
    ).catch((err) => {
      console.log("Publisher Error in Rest Controller:", err);
    });
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.abuseHeuristicTriggerId = this.id;
    if (!this.abuseHeuristicTriggerId)
      this.abuseHeuristicTriggerId = newUUID(false);

    const dataClause = {
      id: this.abuseHeuristicTriggerId,
      triggerType: this.triggerType,
      userId: this.userId,
      ipAddress: this.ipAddress,
      targetId: this.targetId,
      details: this.details
        ? typeof this.details == "string"
          ? JSON.parse(this.details)
          : this.details
        : null,
    };

    return dataClause;
  }
}

module.exports = CreateAbuseHeuristicTriggerManager;
