const ModerationActionManager = require("./ModerationActionManager");
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
const { dbCreateModerationaction } = require("dbLayer");

class CreateModerationActionManager extends ModerationActionManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createModerationAction",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "moderationAction";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.communityId = this.communityId;
    jsonObj.targetType = this.targetType;
    jsonObj.targetId = this.targetId;
    jsonObj.actionType = this.actionType;
    jsonObj.performedByUserId = this.performedByUserId;
    jsonObj.performedByRole = this.performedByRole;
    jsonObj.reason = this.reason;
    jsonObj.notes = this.notes;
  }

  readRestParameters(request) {
    this.communityId = request.body?.communityId;
    this.targetType = request.body?.targetType;
    this.targetId = request.body?.targetId;
    this.actionType = request.body?.actionType;
    this.performedByUserId = request.session?.userId;
    this.performedByRole = request.body?.performedByRole;
    this.reason = request.body?.reason;
    this.notes = request.body?.notes;
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
    this.actionType = request.mcpParams.actionType;
    this.performedByUserId = request.session.userId;
    this.performedByRole = request.mcpParams.performedByRole;
    this.reason = request.mcpParams.reason;
    this.notes = request.mcpParams.notes;
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

    if (this.actionType == null) {
      throw new BadRequestError("errMsg_actionTypeisRequired");
    }

    if (this.performedByUserId == null) {
      throw new BadRequestError("errMsg_performedByUserIdisRequired");
    }

    if (this.performedByRole == null) {
      throw new BadRequestError("errMsg_performedByRoleisRequired");
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
      this.performedByUserId &&
      !isValidObjectId(this.performedByUserId) &&
      !isValidUUID(this.performedByUserId)
    ) {
      throw new BadRequestError("errMsg_performedByUserIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.moderationAction?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateModerationaction function to create the moderationaction and return the result to the controller
    const moderationaction = await dbCreateModerationaction(this);

    return moderationaction;
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.moderationActionId = this.id;
    if (!this.moderationActionId) this.moderationActionId = newUUID(false);

    const dataClause = {
      id: this.moderationActionId,
      communityId: this.communityId,
      targetType: this.targetType,
      targetId: this.targetId,
      actionType: this.actionType,
      performedByUserId: this.performedByUserId,
      performedByRole: this.performedByRole,
      reason: this.reason,
      notes: this.notes,
    };

    return dataClause;
  }
}

module.exports = CreateModerationActionManager;
