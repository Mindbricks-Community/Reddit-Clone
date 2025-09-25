const ModerationAuditLogManager = require("./ModerationAuditLogManager");
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
const { dbCreateModerationauditlog } = require("dbLayer");

class CreateModerationAuditLogManager extends ModerationAuditLogManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createModerationAuditLog",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "moderationAuditLog";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.logEntryType = this.logEntryType;
    jsonObj.communityId = this.communityId;
    jsonObj.entityType = this.entityType;
    jsonObj.entityId = this.entityId;
    jsonObj.actionUserId = this.actionUserId;
    jsonObj.linkedModerationActionId = this.linkedModerationActionId;
  }

  readRestParameters(request) {
    this.logEntryType = request.body?.logEntryType;
    this.communityId = request.body?.communityId;
    this.entityType = request.body?.entityType;
    this.entityId = request.body?.entityId;
    this.actionUserId = request.body?.actionUserId;
    this.linkedModerationActionId = request.body?.linkedModerationActionId;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.logEntryType = request.mcpParams.logEntryType;
    this.communityId = request.mcpParams.communityId;
    this.entityType = request.mcpParams.entityType;
    this.entityId = request.mcpParams.entityId;
    this.actionUserId = request.mcpParams.actionUserId;
    this.linkedModerationActionId = request.mcpParams.linkedModerationActionId;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.logEntryType == null) {
      throw new BadRequestError("errMsg_logEntryTypeisRequired");
    }

    if (this.communityId == null) {
      throw new BadRequestError("errMsg_communityIdisRequired");
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
      this.entityId &&
      !isValidObjectId(this.entityId) &&
      !isValidUUID(this.entityId)
    ) {
      throw new BadRequestError("errMsg_entityIdisNotAValidID");
    }

    // ID
    if (
      this.actionUserId &&
      !isValidObjectId(this.actionUserId) &&
      !isValidUUID(this.actionUserId)
    ) {
      throw new BadRequestError("errMsg_actionUserIdisNotAValidID");
    }

    // ID
    if (
      this.linkedModerationActionId &&
      !isValidObjectId(this.linkedModerationActionId) &&
      !isValidUUID(this.linkedModerationActionId)
    ) {
      throw new BadRequestError("errMsg_linkedModerationActionIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.moderationAuditLog?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateModerationauditlog function to create the moderationauditlog and return the result to the controller
    const moderationauditlog = await dbCreateModerationauditlog(this);

    return moderationauditlog;
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.moderationAuditLogId = this.id;
    if (!this.moderationAuditLogId) this.moderationAuditLogId = newUUID(false);

    const dataClause = {
      id: this.moderationAuditLogId,
      logEntryType: this.logEntryType,
      communityId: this.communityId,
      entityType: this.entityType,
      entityId: this.entityId,
      actionUserId: this.actionUserId,
      linkedModerationActionId: this.linkedModerationActionId,
    };

    return dataClause;
  }
}

module.exports = CreateModerationAuditLogManager;
