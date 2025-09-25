const AutomodEventManager = require("./AutomodEventManager");
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
const { dbCreateAutomodevent } = require("dbLayer");

class CreateAutomodEventManager extends AutomodEventManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createAutomodEvent",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "automodEvent";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.communityId = this.communityId;
    jsonObj.targetType = this.targetType;
    jsonObj.targetId = this.targetId;
    jsonObj.automodType = this.automodType;
    jsonObj.ruleId = this.ruleId;
    jsonObj.performedByAutomod = this.performedByAutomod;
    jsonObj.triggerDetails = this.triggerDetails;
  }

  readRestParameters(request) {
    this.communityId = request.body?.communityId;
    this.targetType = request.body?.targetType;
    this.targetId = request.body?.targetId;
    this.automodType = request.body?.automodType;
    this.ruleId = request.body?.ruleId;
    this.performedByAutomod = request.body?.performedByAutomod;
    this.triggerDetails = request.body?.triggerDetails;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.communityId = request.mcpParams.communityId;
    this.targetType = request.mcpParams.targetType;
    this.targetId = request.mcpParams.targetId;
    this.automodType = request.mcpParams.automodType;
    this.ruleId = request.mcpParams.ruleId;
    this.performedByAutomod = request.mcpParams.performedByAutomod;
    this.triggerDetails = request.mcpParams.triggerDetails;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.communityId == null) {
      throw new BadRequestError("errMsg_communityIdisRequired");
    }

    if (this.targetType == null) {
      throw new BadRequestError("errMsg_targetTypeisRequired");
    }

    if (this.targetId == null) {
      throw new BadRequestError("errMsg_targetIdisRequired");
    }

    if (this.automodType == null) {
      throw new BadRequestError("errMsg_automodTypeisRequired");
    }

    if (this.performedByAutomod == null) {
      throw new BadRequestError("errMsg_performedByAutomodisRequired");
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
      this.targetId &&
      !isValidObjectId(this.targetId) &&
      !isValidUUID(this.targetId)
    ) {
      throw new BadRequestError("errMsg_targetIdisNotAValidID");
    }

    // ID
    if (
      this.ruleId &&
      !isValidObjectId(this.ruleId) &&
      !isValidUUID(this.ruleId)
    ) {
      throw new BadRequestError("errMsg_ruleIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.automodEvent?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateAutomodevent function to create the automodevent and return the result to the controller
    const automodevent = await dbCreateAutomodevent(this);

    return automodevent;
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.automodEventId = this.id;
    if (!this.automodEventId) this.automodEventId = newUUID(false);

    const dataClause = {
      id: this.automodEventId,
      communityId: this.communityId,
      targetType: this.targetType,
      targetId: this.targetId,
      automodType: this.automodType,
      ruleId: this.ruleId,
      performedByAutomod: this.performedByAutomod,
      triggerDetails: this.triggerDetails
        ? typeof this.triggerDetails == "string"
          ? JSON.parse(this.triggerDetails)
          : this.triggerDetails
        : null,
    };

    return dataClause;
  }
}

module.exports = CreateAutomodEventManager;
